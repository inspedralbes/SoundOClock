<?php

namespace App\Http\Controllers;
use App\Models\Bell;
use Illuminate\Support\Facades\DB;

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
        
        // Validate data
        $request->validate([
            'bells' => 'required|array|min:1',
            'bells.*.groups' => 'required|array|min:1'
        ]);

        // Check that the user is an admin
        if (auth()->user()->role_id !== 1) {
            return response()->json([
                'status' => 'error',
                'message' => 'You do not have admin permissions.'
            ], 404);
        }

        $bells = $request['bells'];

        // Wrap the operation inside a transaction
        DB::beginTransaction();

        try {
            
            // For each bell...
            foreach ($bells as $bell) {
                
                // Find the bell
                $selectedBell = Bell::find($bell['id']);

                // Check that the bell exists
                if (!$selectedBell) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'The bell does not exist.'
                    ], 404);
                }

                // Delete all groups associated with the bell
                $selectedBell->groups()->detach();
                
                // Format group IDs associated with a bell inside an array: $groups = [1, 2, 3, 4];
                $groups = [];

                foreach ($bell['groups'] as $group) {
                    $groups[] = $group['id'];
                }
                
                // Add new groups to the bell
                $selectedBell->groups()->attach($groups);
            
            }

            // Commit the transaction if everything is successful
            DB::commit();

            return response()->json($bells, 201); 

        } catch (\Exception $e) {
            // Rollback the transaction in case of any error
            DB::rollback();
            
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred. Transaction rolled back.'
            ], 500);
        }
    }

}
