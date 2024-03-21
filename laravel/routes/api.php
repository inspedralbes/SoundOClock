<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlacklistController;
use App\Http\Controllers\GroupsController;

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
Route::post('/login', [AuthController::class,'login']);
Route::get('/groups', [GroupsController::class, 'index']);

// Protected routes
Route::group(['middleware' => ['auth:sanctum']], function () {
    // Auth routes
    Route::post('/logout', [AuthController::class,'logout']);
    Route::post('/getUser', [AuthController::class,'getUser']);

    // Blacklist routes
    Route::get('/blacklist', [BlacklistController::class,'index']);
    Route::get('/blacklist/{id}', [BlacklistController::class,'show']);
    Route::post('/blacklist', [BlacklistController::class,'store']);
    Route::delete('/blacklist/{id}', [BlacklistController::class,'destroy']);

    // Groups routes
    Route::post('/groups', [GroupsController::class, 'store']);
    Route::get('/groups/{id}', [GroupsController::class, 'show']);
    Route::put('/groups/{id}', [GroupsController::class, 'update']);
    Route::delete('/groups/{id}', [GroupsController::class, 'destroy']);

    // Groups & Users routes
    Route::post('/addGroupsToUser/{user_id}', [GroupsController::class, 'addGroupsToUser']);
    Route::put('/updateGroupsToUser/{user_id}', [GroupsController::class, 'updateGroupsToUser']);
    Route::delete('/removeGroupsFromUser/{user_id}', [GroupsController::class, 'removeGroupsFromUser']);
});
