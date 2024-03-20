<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlacklistController;
use App\Http\Controllers\ClassGroupsController;

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

// Public routes
Route::post('/register', [AuthController::class,'register']);
Route::post('/login', [AuthController::class,'login']);

// Protected routes
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('/logout', [AuthController::class,'logout']);
    Route::post('/getUser', [AuthController::class,'getUser']);
    Route::get('/blacklist', [BlacklistController::class,'index']);
    Route::get('/blacklist/{id}', [BlacklistController::class,'show']);
    Route::post('/blacklist', [BlacklistController::class,'store']);
    Route::delete('/blacklist/{id}', [BlacklistController::class,'destroy']);
});

Route::group(['prefix' => 'classgroups'], function () {
    Route::get('/', [ClassGroupsController::class, 'index']);
    Route::post('/create', [ClassGroupsController::class, 'create']);
    Route::post('/update', [ClassGroupsController::class, 'update']);
    Route::post('/delete', [ClassGroupsController::class, 'destroy']);
});