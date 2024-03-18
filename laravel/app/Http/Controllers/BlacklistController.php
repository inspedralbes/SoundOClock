<?php

namespace App\Http\Controllers;

use App\Models\Blacklist;
use Illuminate\Http\Request;

class BlacklistController extends Controller
{
    /**
     * Get the courses data in which a user is enrolled.
     */
    public function index()
    {

        // Validar que l'usuari sigui administrador
        if (auth()->user()->is_admin === 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'No tens permisos d\'administrador.'
            ], 404);
        }

        $songs = Blacklist::all();

        return response()->json($songs);
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

        // Validar els camps
        $request->validate([
            'nom' => 'required|string',
            'spotify_id' => 'required|numeric',
        ]);

        // Validar que l'usuari sigui administrador
        if (auth()->user()->is_admin === 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'No tens permisos d\'administrador.'
            ], 404);
        }
        
        // Insertar cançó a la blacklist
        $song = new Blacklist();
        $song->nom = $request->nom;
        $song->spotify_id = $request->spotify_id;
        $song->save();

        return response()->json($song, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        
        // Validar que l'usuari sigui administrador
        if (auth()->user()->is_admin === 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'No tens permisos d\'administrador.'
            ], 404);
        }

        $song = Blacklist::findOrFail($id);

        return response()->json($song);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Blacklist $Blacklist)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Blacklist $Blacklist)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {

        // Validar que l'usuari sigui administrador
        if (auth()->user()->is_admin === 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'No tens permisos d\'administrador.'
            ], 404);
        }
        
        // Validar que la cançó existeix
        $song = Blacklist::find($id);
        if ($song == null) {
            return response()->json([
                'status' => 'error',
                'message' => 'La cançó no existeix.'
            ], 404);
        }

        Blacklist::destroy($id);
        return response()->json($song);
    }
}
