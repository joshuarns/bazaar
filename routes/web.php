<?php

use Illuminate\Support\Facades\Route;

// Admin SPA — todas las rutas del admin cargan la misma vista
Route::get('/admin/{any?}', fn () => view('admin'))->where('any', '.*');

// Frontend SPA — el resto de rutas
Route::get('/{any?}', fn () => view('frontend'))->where('any', '.*');
