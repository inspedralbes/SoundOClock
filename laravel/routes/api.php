<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SongController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['prefix' => 'songs'], function () {
    Route::get('/', [SongController::class, 'index'])->name('index');
    // Route::get('/{song}', [SongController::class, 'show'])->name('show');
    // Route::post('/', [SongController::class, 'store'])->name('store');
    // Route::put('/{song}', [SongController::class, 'update'])->name('update');
    // Route::delete('/{song}', [SongController::class, 'destroy'])->name('destroy');
});