<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log; // Added for logging API errors

class EventController extends Controller
{
    protected $jsonFile;

    public function __construct()
    {
        $this->jsonFile = base_path('event.json');
    }

    // List all events
    public function index()
    {
        $events = $this->readEvents();

        // Fetch and update weather if missing or empty coordinates
        $updated = false;
        foreach ($events as &$event) { // Use & for reference to modify the original array
            // Ensure 'location' is treated as the city for weather
            // Also, update if weather is missing or doesn't have coordinates
            if (!isset($event['weather']) || empty($event['weather']['coord']) || !isset($event['location'])) {
                $event['weather'] = $this->getWeatherForLocation($event['location'] ?? null); // Use null if location is somehow missing
                $updated = true;
            }
        }

        if ($updated) {
            $this->writeEvents($events);
        }

        return response()->json($events);
    }

    // Store a new event with weather
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'date' => 'required|date|after_or_equal:today',
            'time' => 'required|string', // <-- Added/Ensured
            'category' => 'required|string', // <-- Added/Ensured
            'location' => 'required|string|max:255', // This is for the City (weather)
            'address' => 'nullable|string|max:255',   // <-- NEW: Validation for Full Address
            'description' => 'required|string',
            'image_url' => 'nullable|url',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $events = $this->readEvents();

        $newEvent = $request->all(); // This will automatically pick up 'address' and other fields if sent by frontend
        $newEvent['id'] = $this->generateId($events);

        // Weather is fetched based on the 'location' field (which should be the city)
        $newEvent['weather'] = $this->getWeatherForLocation($newEvent['location']);

        $events[] = $newEvent;
        $this->writeEvents($events);

        return response()->json($newEvent, 201);
    }

    public function show($id)
    {
        $events = $this->readEvents();

        foreach ($events as $event) {
            if ($event['id'] == $id) {
                return response()->json($event);
            }
        }

        return response()->json(['message' => 'Event not found'], 404);
    }

    // Update an existing event
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'date' => 'required|date|after_or_equal:today',
            'time' => 'required|string', // <-- Added/Ensured
            'category' => 'required|string', // <-- Added/Ensured
            'location' => 'required|string|max:255', // This is for the City (weather)
            'address' => 'required|string|max:255',   // <-- NEW: Validation for Full Address
            'description' => 'required|string',
            'image_url' => 'nullable|url',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $events = $this->readEvents();

        $found = false;
        foreach ($events as &$event) { // Use & for reference to modify the original array
            if ($event['id'] == $id) {
                // Store original city for comparison, handle if not set
                $originalLocation = $event['location'] ?? null;

                // Merge incoming data with existing event data.
                // This ensures fields not sent from the frontend (like original weather) are retained.
                // It will now also correctly merge the 'address' field if sent.
                $event = array_merge($event, $request->all());

                // Condition to re-fetch weather:
                // 1. If the 'location' (city) field has changed.
                // 2. Or, if the event currently has no weather data or invalid coordinates.
                if (
                    ($event['location'] !== $originalLocation) ||
                    empty($event['weather']) ||
                    empty($event['weather']['coord'])
                ) {
                    // Pass null if location is empty to getWeatherForLocation
                    $newWeather = $this->getWeatherForLocation($event['location'] ?? null);
                    // Only update weather if a successful response was received
                    if ($newWeather !== null) {
                        $event['weather'] = $newWeather;
                    }
                    // Else (if $newWeather is null), the $event['weather'] will remain
                    // whatever it was after the array_merge, effectively preserving it
                    // if the re-fetch failed but the frontend had sent it.
                }

                $event['id'] = $id; // Ensure ID remains consistent after the merge
                $found = true;
                break; // Stop iterating once the event is found and updated
            }
        }

        if (!$found) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        $this->writeEvents($events);

        // Return the updated event data
        return response()->json($event, 200);
    }

    // Delete an event
    public function destroy($id)
    {
        $events = $this->readEvents();

        $filtered = array_filter($events, fn($event) => $event['id'] != $id);

        if (count($events) === count($filtered)) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        $this->writeEvents(array_values($filtered));

        return response()->json(null, 204);
    }

    protected function readEvents()
    {
        if (!file_exists($this->jsonFile)) {
            file_put_contents($this->jsonFile, json_encode([]));
        }

        $json = file_get_contents($this->jsonFile);
        return json_decode($json, true) ?? [];
    }

    protected function writeEvents(array $events)
    {
        file_put_contents($this->jsonFile, json_encode($events, JSON_PRETTY_PRINT));
    }

    // Generate unique ID
    protected function generateId(array $events)
    {
        if (empty($events)) {
            return 1;
        }

        $ids = array_column($events, 'id');
        return max($ids) + 1;
    }

    protected function getWeatherForLocation($location)
    {
        // Handle cases where location might be null or empty string
        if (empty($location)) {
            Log::info('Skipping weather fetch: Location is empty.');
            return null;
        }

        $apiKey = config('services.openweather.key');

        // Check if API key is configured
        if (empty($apiKey)) {
            Log::error('OpenWeatherMap API key is not configured in services.openweather.key');
            return null;
        }

        $response = Http::get("https://api.openweathermap.org/data/2.5/weather", [
            'q' => $location,
            'appid' => $apiKey,
            'units' => 'metric'
        ]);

        if ($response->successful()) {
            $data = $response->json();
            return [
                'temp' => $data['main']['temp'] ?? null,
                'description' => $data['weather'][0]['description'] ?? null,
                'icon' => $data['weather'][0]['icon'] ?? null,
                'coord' => [
                    'lat' => $data['coord']['lat'] ?? null,
                    'lon' => $data['coord']['lon'] ?? null,
                ],
            ];
        }

        // Log the error response if not successful for debugging
        Log::error('OpenWeatherMap API request failed for location: ' . $location, [
            'status' => $response->status(),
            'body' => $response->body()
        ]);

        return null;
    }
}
