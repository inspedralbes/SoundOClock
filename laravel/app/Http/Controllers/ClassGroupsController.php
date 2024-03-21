<?php

namespace App\Http\Controllers;

use App\Models\ClassGroup;
use Illuminate\Http\Request;

class ClassGroupsController extends Controller
{
     public function index() {
        return ClassGroup::all();
    }

     public function store(Request $request) {
        $fields = $request->validate([
            'name' => 'required|string',
            'abbreviation' => 'required|string',
            'is_public' => 'required|int',
        ]);

        return ClassGroup::create($request->all());
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
