<?php

use App\Models\User;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Validator;

use function Laravel\Prompts\password;
use function Laravel\Prompts\text;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/*
 * Crea (o actualiza la contraseña de) un usuario del panel admin.
 * Interactivo:      php artisan bazaar:admin
 * Sin preguntas:    php artisan bazaar:admin --email=tu@correo.com --name="Tu nombre" --password=...
 */
Artisan::command('bazaar:admin {--email=} {--name=} {--password=}', function () {
    $email = $this->option('email') ?: text('Email', required: true, validate: ['email' => 'email']);
    $existing = User::where('email', $email)->first();

    $name = $this->option('name')
        ?: ($existing?->name ?? text('Nombre', default: 'Administrador', required: true));

    $plain = $this->option('password') ?: password('Contraseña (mínimo 8 caracteres)', required: true);

    $validator = Validator::make(
        ['email' => $email, 'password' => $plain],
        ['email' => 'email', 'password' => 'min:8'],
    );
    if ($validator->fails()) {
        $this->error($validator->errors()->first());

        return 1;
    }

    User::updateOrCreate(['email' => $email], ['name' => $name, 'password' => $plain]);

    $this->info($existing
        ? "Contraseña actualizada para {$email}."
        : "Administrador {$email} creado. Ya puedes entrar en /admin.");

    return 0;
})->purpose('Crea o actualiza un usuario del panel admin');
