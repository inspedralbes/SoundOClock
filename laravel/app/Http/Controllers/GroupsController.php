<?php

namespace App\Http\Controllers;
use App\Models\Group;
use App\Models\User;

use Illuminate\Http\Request;

class GroupsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {
        return Group::where('is_public', '<>', 0)->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) {
        // Validate that user is admin
        if (auth()->user()->role_id !== 1) {
            return response()->json([
                'status' => 'error',
                'message' => 'You do not have admin permissions.'
            ], 404);
        }

        $fields = $request->validate([
            'name' => 'required|string',
            'abbreviation' => 'required|string',
            'is_public' => 'required|int',
        ]);

        return Group::create($request->all());
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Group::findOrfail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id) {
        // Validate that user is admin
        if (auth()->user()->role_id !== 1) {
            return response()->json([
                'status' => 'error',
                'message' => 'You do not have admin permissions.'
            ], 404);
        }

        $fields = $request->validate([
            'name' => 'required|string',
            'abbreviation' => 'required|string',
            'is_public' => 'required|int',
        ]);

        $group = Group::findOrfail($id);
        $group->update($request->all());
        return $group;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id) {
        // Validate that user is admin
        if (auth()->user()->role_id !== 1) {
            return response()->json([
                'status' => 'error',
                'message' => 'You do not have admin permissions.'
            ], 404);
        }

        // Validate that the group exists
        $group = Group::find($id);
        if ($group == null) {
            return response()->json([
                'status' => 'error',
                'message' => 'The group does not exist.'
            ], 404);
        }

        return Group::destroy($id);
    }

    // Return all groups from the user
    public function getGroupsFromUser(string $user_id) {
        $user = User::findOrfail($user_id);
        return $user->groups;
    }

    // Add groups to the user
    public function addGroupsToUser(Request $request, string $user_id) {
        $fields = $request->validate([
            'groups' => 'required|array',
        ]);

        $user = User::findOrfail($user_id);
        $user->groups()->attach($fields['groups']);
        // Return the user with its groups
        return $user->groups;
    }

    // Remove all groups from the user and add the new ones
    public function updateGroupsToUser(Request $request, string $user_id) {
        $fields = $request->validate([
            'groups' => 'required|array',
        ]);

        $user = User::findOrfail($user_id);
        // This will remove all groups from the user and add the new ones
        $user->groups()->sync($fields['groups']);
        return $user->groups;
    }

    // Remove all groups from the user
    public function removeGroupsFromUser(string $user_id) {
        $user = User::findOrfail($user_id);
        $user->groups()->detach();
        return $user;
    }
}
