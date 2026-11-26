<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

/**
 * Gestión de usuarios del panel (solo administradores).
 */
class UserController extends Controller
{
    public function index()
    {
        return User::orderBy('name')->get(['id', 'name', 'email', 'role', 'created_at']);
    }

    public function show(User $user)
    {
        return $user->only(['id', 'name', 'email', 'role', 'created_at']);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:120',
            'email'    => 'required|email|max:255|unique:users,email',
            'role'     => ['required', Rule::in(User::ROLES)],
            'password' => ['required', Password::min(8)],
        ]);

        $user = User::create($data);

        return response()->json($user->only(['id', 'name', 'email', 'role', 'created_at']), 201);
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name'     => 'sometimes|required|string|max:120',
            'email'    => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'role'     => ['sometimes', 'required', Rule::in(User::ROLES)],
            'password' => ['nullable', Password::min(8)],
        ]);

        if (isset($data['role']) && $data['role'] !== User::ROLE_ADMIN && $user->isAdmin()) {
            if ($user->is($request->user())) {
                return $this->refuse('No puedes quitarte el rol de administrador a ti mismo.');
            }
            if ($this->isLastAdmin($user)) {
                return $this->refuse('Debe quedar al menos un administrador.');
            }
        }

        if (empty($data['password'])) {
            unset($data['password']);
        }

        $user->update($data);

        return response()->json($user->only(['id', 'name', 'email', 'role', 'created_at']));
    }

    public function destroy(Request $request, User $user)
    {
        if ($user->is($request->user())) {
            return $this->refuse('No puedes borrar tu propio usuario.');
        }
        if ($user->isAdmin() && $this->isLastAdmin($user)) {
            return $this->refuse('Debe quedar al menos un administrador.');
        }

        $user->delete();

        return response()->noContent();
    }

    private function isLastAdmin(User $user): bool
    {
        return User::where('role', User::ROLE_ADMIN)->whereKeyNot($user->id)->doesntExist();
    }

    private function refuse(string $message)
    {
        return response()->json(['message' => $message], 422);
    }
}
