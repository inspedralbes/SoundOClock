<?php

namespace App\Http\Controllers;
use App\Models\Bell;

use Illuminate\Http\Request;

class BellController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {
        
        $bells = Bell::all();

        // foreach ($bells as $bell) {
        //     $bell->groups()->attach($group['group_id'], ['course' => $group['course']]);
        // }
    }

}
