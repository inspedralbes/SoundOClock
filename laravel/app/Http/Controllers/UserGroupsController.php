<?php

namespace App\Http\Controllers;
use App\Models\Group;
use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserGroupsController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index() {

        $user = auth()->user();

        $groups = $user->groups;

        foreach ($groups as &$group) {
            $group->usuaris = DB::table('users')
            ->join('group_user', 'users.id', '=', 'group_user.user_id')
            ->where('group_user.group_id', '=',  $group->id)
            ->select('users.id', 'users.name', 'users.email', 'users.role_id')
            ->orderBy('users.role_id')
            ->orderBy('users.name')
            ->get();
        }

        return $groups;
    }

    // Remove a group from the user
    public function delete(string $group_id, string $user_id) {

        // Validate that user has permissions
        if (auth()->user()->role_id == 5) {
            return response()->json([
                'status' => 'error',
                'message' => 'You do not have admin permissions.'
            ], 404);
        }

        // Check if the user exists
        $user = User::find($user_id);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'L\'usuari no existeix.'
            ], 404);
        }

        // Check if the group exists
        $group = Group::find($group_id);

        if (!$group) {
            return response()->json([
                'status' => 'error',
                'message' => 'El grup no existeix.'
            ], 404);
        }

        $user->groups()->detach([$group->id]);

        return ['group' => $group, 'user' => $user];
    }
}