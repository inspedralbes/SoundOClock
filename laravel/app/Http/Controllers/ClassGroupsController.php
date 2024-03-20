<?php

namespace App\Http\Controllers;

use App\Models\classGroups;
use Illuminate\Http\Request;

class ClassGroupsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $classGroups = classGroups::all();
        return json_encode($classGroups);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string',
            'abbreviation' => 'required|string',
            'is_public' => 'required|int',
        ]);

        classGroups::create([
            'name' => $fields['name'],
            'abbreviation' => $fields['abbreviation'],
            'is_public' => $fields['is_public'],
        ]);

        return response('Class Group Created', 201);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(classGroups $classGroups)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(classGroups $classGroups)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        //
        $fields = $request->validate([
            'id' => 'required|int',
            'name' => 'required|string',
            'abbreviation' => 'required|string',
            'is_public' => 'required|int',
        ]);

        $classGroup = classGroups::find($fields['id']);

        $classGroup->name = $fields['name'];
        $classGroup->abbreviation = $fields['abbreviation'];
        $classGroup->is_public = $fields['is_public'];
        $classGroup->save();

        return response('Class Group Updated', 200);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        //
        $fields = $request->validate([
            'id' => 'required|int',
        ]);

        $classGroup = classGroups::find($fields['id']);

        $classGroup->delete();

        return response('Class Group Deleted', 200);
    }
}
