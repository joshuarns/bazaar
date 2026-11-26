<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Admin;
use App\Http\Controllers\Auth\SessionController;

// --- Sesión del panel admin ---
Route::post('/login', [SessionController::class, 'store'])->middleware('throttle:6,1');
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [SessionController::class, 'show']);
    Route::post('/logout', [SessionController::class, 'destroy']);
});

// --- Public API ---
Route::get('/home', HomeController::class);
Route::get('/articles/{category}/{slug}', [ArticleController::class, 'show']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);

// --- Admin API (requires auth) ---
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/stats', Admin\StatsController::class);
    Route::apiResource('/articles', Admin\ArticleController::class);
    Route::apiResource('/banners', Admin\BannerController::class)->only(['index', 'store', 'destroy']);
    Route::apiResource('/categories', Admin\CategoryController::class)->only(['index', 'store', 'destroy']);
    Route::get('/tags', fn () => \App\Models\Tag::orderBy('name')->pluck('name'));
    Route::post('/uploads', [Admin\UploadController::class, 'store']);
});
