<?php

namespace App\Http\Controllers;
use App\Models\Group;

use Illuminate\Http\Request;

class GroupsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {
        return Group::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) {
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
        return Group::destroy($id);
    }
}
