<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Admin;

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
});
