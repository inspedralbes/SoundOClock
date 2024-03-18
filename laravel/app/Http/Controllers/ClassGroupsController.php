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
    public function create()
    {
        //
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
    public function update(Request $request, classGroups $classGroups)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(classGroups $classGroups)
    {
        //
    }
}