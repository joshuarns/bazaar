<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

/**
 * Login del panel admin con sesión (Sanctum en modo SPA, mismo dominio).
 */
class SessionController extends Controller
{
    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if (! Auth::guard('web')->attempt($credentials, $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'email' => 'Credenciales incorrectas.',
            ]);
        }

        $request->session()->regenerate();

        return response()->json($request->user());
    }

    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->noContent();
    }
}
