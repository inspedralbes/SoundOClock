<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlacklistController;
use App\Http\Controllers\GroupsController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\BellController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\GroupCategoryController;
use App\Http\Controllers\UserGroupsController;

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
Route::get('/groupCategories', [GroupCategoryController::class, 'index']);
Route::get('/groupCategoriesAll', [GroupCategoryController::class, 'indexAll']);
Route::get('/allSettings', [SettingController::class, 'index']);
Route::get('/bells', [BellController::class, 'index']);

// Protected routes
Route::group(['middleware' => ['auth:sanctum']], function () {
    // Auth routes
    Route::post('/logout', [AuthController::class,'logout']);
    Route::get('/getUser', [AuthController::class,'getUser']);
    Route::get('/blacklist', [BlacklistController::class,'index']);
    Route::get('/blacklist/{id}', [BlacklistController::class,'show']);
    Route::post('/blacklist', [BlacklistController::class,'store']);
    Route::delete('/blacklist/{id}', [BlacklistController::class,'destroy']);
    Route::get('/user/{id}', [AuthController::class, 'show']);
    Route::put('/user/{id}', [AuthController::class, 'update']);
    Route::post('/usersSearchInfo', [AuthController::class, 'indexUsers']);

    // Groups routes
    Route::post('/groups', [GroupsController::class, 'store']);
    Route::delete('/groups/{id}', [GroupsController::class, 'destroy']);
    Route::get('/groups/{id}', [GroupsController::class, 'show']);
    Route::put('/groups/{id}', [GroupsController::class, 'update']);

    // Group Categories routes
    Route::post('/groupCategories', [GroupCategoryController::class, 'store']);
    Route::get('/groupCategories/{id}', [GroupCategoryController::class, 'show']);
    Route::put('/groupCategories/{id}', [GroupCategoryController::class, 'update']);
    Route::delete('/groupCategories/{id}', [GroupCategoryController::class, 'destroy']);
    
    // Groups & Users routes
    Route::post('/groupsUser', [GroupsController::class, 'addGroupsToUser']);
    Route::get('/groupsUser/{user_id}', [GroupsController::class, 'getGroupsFromUser']);
    Route::put('/groupsUser/{user_id}', [GroupsController::class, 'updateGroupsToUser']);
    Route::delete('/groupsUser/{user_id}', [GroupsController::class, 'removeGroupsFromUser']);

    // Roles routes
    Route::get('/roles', [RolesController::class, 'index']);
    Route::post('/roles', [RolesController::class, 'store']);
    Route::get('/roles/{id}', [RolesController::class, 'show']);
    Route::put('/roles/{id}', [RolesController::class, 'update']);
    Route::delete('/roles/{id}', [RolesController::class, 'destroy']);

    // Bells routes
    // Route::get('/bells', [BellController::class, 'index']);
    Route::post('/bells', [BellController::class, 'store']);
    Route::put('/updateBells', [BellController::class, 'update']);

    // Settings routes
    Route::post('/settings', [SettingController::class, 'store']);
    Route::get('/settings', [SettingController::class, 'show']);
    Route::put('/settings', [SettingController::class, 'update']);
    Route::delete('/settings/{id}', [SettingController::class, 'destroy']);

    // User groups
    Route::get('/userGroups', [UserGroupsController::class, 'index']);
    Route::delete('/group/{group_id}/user/{user_id}', [UserGroupsController::class, 'delete']);
});
