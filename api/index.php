<?php

/*
 * Punto de entrada de la función serverless en Vercel (runtime vercel-php).
 * Todas las peticiones que no son archivos estáticos llegan aquí.
 *
 * Vercel ejecuta este archivo como /api/index.php. Laravel deduce la URL base
 * a partir de SCRIPT_NAME, así que trataría /api/home como /home y las rutas de
 * la API dejarían de funcionar. Lo presentamos como si fuera public/index.php.
 */

$_SERVER['SCRIPT_FILENAME'] = __DIR__.'/../public/index.php';
$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['PHP_SELF'] = '/index.php';

require __DIR__.'/../public/index.php';
