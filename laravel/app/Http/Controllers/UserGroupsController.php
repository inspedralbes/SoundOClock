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
            ->get();
        }

        return $groups;
    }
}