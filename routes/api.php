<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;
use Illuminate\Http\Request; // <-- Add this line if not already present

// Public routes (no authentication required)
Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{id}', [EventController::class, 'show']);
Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});

// Protected routes (require Sanctum authentication)
Route::middleware('auth:sanctum')->group(function () {
    // --- ADD THIS LINE FOR THE USER ENDPOINT ---
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    // --- END ADDITION ---

    Route::post('/events', [EventController::class, 'store']);
    Route::put('/events/{id}', [EventController::class, 'update']);
    Route::delete('/events/{id}', [EventController::class, 'destroy']);
});
