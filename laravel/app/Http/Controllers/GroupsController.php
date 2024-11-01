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
     * Display a listing of the resource.
     */
    public function indexAll() {
        return Group::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) {
        // Validate that user is admin
        if (auth()->user()->role_id !== 1 && auth()->user()->role_id !== 2) {
            return response()->json([
                'status' => 'error',
                'message' => 'You do not have admin permissions.'
            ], 404);
        }

        $fields = $request->validate([
            'name' => 'required|string',
            'abbreviation' => 'required|string',
            'is_public' => 'required|int',
            'category_id' => 'required|int',
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
        if (auth()->user()->role_id !== 1 && auth()->user()->role_id !== 2) {
            return response()->json([
                'status' => 'error',
                'message' => 'You do not have admin permissions.'
            ], 404);
        }

        $fields = $request->validate([
            'name' => 'required|string',
            'abbreviation' => 'required|string',
            'is_public' => 'required|int',
            'category_id' => 'int',
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
        if (auth()->user()->role_id !== 1 && auth()->user()->role_id !== 2) {
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

        Group::destroy($id);
        return response()->json([
            'status' => 'success',
            'message' => 'Group successfully deleted.',
            'group_id' => $id
        ],200);
    }

    // Return all groups from the user
    public function getGroupsFromUser(string $user_id) {
        $user = User::findOrfail($user_id);
        return $user->groups;
    }

    // Add groups to the user
    public function addGroupsToUser(Request $request) {

        // Validate the request
        $validated = $request->validate([
            'user_id' => 'required|int|exists:users,id', // Validates the user_id exists in users table
            'groups' => 'required|array',
            'groups.*' => 'required|exists:groups,id' // Validates each group_id exists in groups table
        ]);

        //find user by id
        $user = User::find($request->user_id);

        //validate if this user has a group
        if($user->groups->count() > 0){
                
            //validate if user has permissions
            if(
                $user->role_id !== 1 && // Tech
                $user->role_id !== 2 && // Admin
                $user->role_id !== 3 && // Moderator
                $user->role_id !== 4    // Professor
                ){
                return response()->json([
                    'status' => 'error',
                    'message' => 'You do not have permissions.'
                ], 404);
            }
        }

        $user_id = $validated["user_id"];
        $user = User::findOrFail($user_id);

        // Attach the groups to the user
        foreach ($validated["groups"] as $group_id) {
            $group = Group::findOrFail($group_id);
            // if group is already attached to the user, skip it
            if ($user->groups->contains($group)) {
                continue;
            }
            $user->groups()->attach($group);
        }
    
        // Return the user with its groups
        return $user->load('groups');
    }

    // Update groups to the user (remove all groups and add the new ones)
    public function updateGroupsToUser(Request $request, string $user_id) {
        // Validate the request
        $validated = $request->validate([
            'groups' => 'required|array',
            'groups.*' => 'required|exists:groups,id' // Validates each group_id exists in groups table
        ]);
    
        $user = User::findOrFail($user_id);
    
        // Sync the groups to the user
        $user->groups()->sync($validated["groups"]);
    
        // Return the user with its updated groups
        return $user->load('groups');
    }

    // Remove all groups from the user
    public function removeGroupsFromUser(string $user_id) {
        $user = User::findOrfail($user_id);
        $user->groups()->detach();
        return $user;
    }
}
