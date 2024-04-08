<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlacklistController;
use App\Http\Controllers\GroupsController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\BellController;

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
Route::get('/groupsAll', [GroupsController::class, 'indexAll']);
Route::get('/users', [AuthController::class, 'index']);

// Protected routes
Route::group(['middleware' => ['auth:sanctum']], function () {
    // Auth routes
    Route::post('/logout', [AuthController::class,'logout']);
    Route::get('/getUser', [AuthController::class,'getUser']);
    Route::get('/blacklist', [BlacklistController::class,'index']);
    Route::get('/blacklist/{id}', [BlacklistController::class,'show']);
    Route::post('/blacklist', [BlacklistController::class,'store']);
    Route::delete('/blacklist/{id}', [BlacklistController::class,'destroy']);
    Route::put('/user/{id}', [AuthController::class, 'update']);

    // Groups routes
    Route::post('/groups', [GroupsController::class, 'store']);
    Route::delete('/groups/{id}', [GroupsController::class, 'destroy']);
    Route::get('/groups/{id}', [GroupsController::class, 'show']);
    Route::put('/groups/{id}', [GroupsController::class, 'update']);
    
    // Groups & Users routes
    Route::get('/getGroupsFromUser/{user_id}', [GroupsController::class, 'getGroupsFromUser']);
    Route::post('/addGroupsToUser/{user_id}', [GroupsController::class, 'addGroupsToUser']);
    Route::put('/updateGroupsToUser/{user_id}', [GroupsController::class, 'updateGroupsToUser']);
    Route::delete('/removeGroupsFromUser/{user_id}', [GroupsController::class, 'removeGroupsFromUser']);

    // Roles routes
    Route::get('/roles', [RolesController::class, 'index']);
    Route::post('/roles', [RolesController::class, 'store']);
    Route::get('/roles/{id}', [RolesController::class, 'show']);
    Route::put('/roles/{id}', [RolesController::class, 'update']);
    Route::delete('/roles/{id}', [RolesController::class, 'destroy']);

    // Bells routes
    Route::get('/bells', [BellController::class, 'index']);
});
