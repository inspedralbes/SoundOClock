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

        // Return the bells with its groups
        return $bells->load('groups');
        
    }

    public function update(Request $request) {
        
        $request->validate([
            'bells' => 'required|array',
        ]);

        $bells=$request['bells'];

        // Find bell
        $bell = Bell::find($bells[0]->id);

        $bell->groups()->detach($bell->groups);
        
        // // Format groups id associated to a bell in an array
        // $groups = [];
        // foreach ($bells[0]->groups as $group) {
        //     $groups [] = $group->id;
        // }

        // $bell->groups()->attach($groups);

        return response()->json($request['bells'], 201);
        
    }

}
