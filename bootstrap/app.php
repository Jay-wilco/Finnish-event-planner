<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
use App\Http\Middleware\TrustProxies;


return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->append(TrustProxies::class);

        // Register Sanctum's middleware to make SPA auth work
        $middleware->append(EnsureFrontendRequestsAreStateful::class);

        // This section tells Laravel to bypass CSRF verification for these routes.
        // Useful for API-only routes or for development/demo purposes.
        $middleware->validateCsrfTokens(except: [
            'register', // Exclude the /register route from CSRF checks
            'login',    // Exclude the /login route from CSRF checks
            'api/events', //excluding event api routes from CSRF checks
            'api/events/*', //excluding event api routes from CSRF checks
            'api/events',
            'logout',       //excluding logout too from CSRF checks
            // Add any other routes here that you want to exclude from CSRF checks
        ]);

        // You can add other global middlewares here if needed. For example:
        // $middleware->add('auth', App\Http\Middleware\Authenticate::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // You can configure your exception handling here
    })->create();
