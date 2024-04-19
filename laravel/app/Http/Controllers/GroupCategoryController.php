<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GroupCategory;

class GroupCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {
        return GroupCategory::where('is_public', '<>', 0)->get();
    }

    /**
     * Display a listing of the resource.
     */
    public function indexAll() {
        return GroupCategory::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) {
        // Valifdate that user is admin
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

        return GroupCategory::create($request->all());
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id) {
        return GroupCategory::findOrfail($id);
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

        $groupCategory = GroupCategory::findOrfail($id);
        $groupCategory->update($request->all());
        return $groupCategory;
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

        $groupCategory = GroupCategory::findOrfail($id);
        $groupCategory->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Group category deleted successfully.'
        ]);
    }
}
