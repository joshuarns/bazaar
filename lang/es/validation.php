<?php

/*
 * Mensajes de validación en español para las reglas que usa el proyecto.
 * Las reglas que no estén aquí caen al inglés (APP_FALLBACK_LOCALE).
 */

return [
    'accepted' => 'Debes aceptar :attribute.',
    'alpha_dash' => ':Attribute solo puede contener letras minúsculas, números, guiones y guiones bajos.',
    'array' => ':Attribute debe ser una lista.',
    'boolean' => ':Attribute debe ser verdadero o falso.',
    'confirmed' => 'La confirmación de :attribute no coincide.',
    'date' => ':Attribute no es una fecha válida.',
    'email' => ':Attribute debe ser un correo electrónico válido.',
    'exists' => 'No se encontró :attribute.',
    'file' => ':Attribute debe ser un archivo.',
    'image' => ':Attribute debe ser una imagen.',
    'in' => 'El valor de :attribute no es válido.',
    'integer' => ':Attribute debe ser un número entero.',
    'max' => [
        'array' => ':Attribute no puede tener más de :max elementos.',
        'file' => ':Attribute no puede pesar más de :max kilobytes.',
        'numeric' => ':Attribute no puede ser mayor que :max.',
        'string' => ':Attribute no puede tener más de :max caracteres.',
    ],
    'mimes' => ':Attribute debe ser un archivo de tipo: :values.',
    'min' => [
        'array' => ':Attribute debe tener al menos :min elementos.',
        'file' => ':Attribute debe pesar al menos :min kilobytes.',
        'numeric' => ':Attribute debe ser al menos :min.',
        'string' => ':Attribute debe tener al menos :min caracteres.',
    ],
    'numeric' => ':Attribute debe ser un número.',
    'required' => 'Falta :attribute.',
    'string' => ':Attribute debe ser un texto.',
    'unique' => 'Ya existe un registro con ese valor de :attribute.',
    'uploaded' => 'No se pudo subir :attribute. Puede que el archivo supere el tamaño máximo que permite el servidor.',
    'url' => ':Attribute debe ser una URL válida.',

    'custom' => [],

    'attributes' => [
        'author' => 'el autor',
        'category_id' => 'la categoría',
        'content' => 'el contenido',
        'email' => 'el email',
        'excerpt' => 'la entradilla',
        'featured' => 'destacado',
        'image' => 'la imagen',
        'link' => 'el enlace',
        'meta_description' => 'la descripción SEO',
        'meta_title' => 'el título SEO',
        'name' => 'el nombre',
        'password' => 'la contraseña',
        'position' => 'la posición',
        'published' => 'publicado',
        'published_at' => 'la fecha de publicación',
        'slug' => 'el slug',
        'tags' => 'las etiquetas',
        'title' => 'el título',
    ],
];
