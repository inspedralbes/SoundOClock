<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Setting;

class SettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Setting::all();
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

        if (Setting::count() > 0) {
            // Si ya existe una configuración, puedes manejarlo de acuerdo a tus necesidades,
            // por ejemplo, retornando un mensaje de error o actualizando la configuración existente
            return response()->json(['message' => 'Ya existe una configuración en la base de datos'], 400);
        }

        $request->validate([
            'start_vote' => 'date',
            'end_vote' => 'date',
            'start_moderation' => 'date',
            'end_moderation' => 'date',
            'showExplicit' => 'boolean',
            'letProposeExplicit' => 'boolean',
            'alertExplicit' => 'boolean',
            'theme' => 'string',
            'teacher_email_key' => 'string',
            'student_email_key' => 'string',
        ]);

        return Setting::create($request->all());

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {

        $setting = Setting::findOrFail($id);
        return $setting;

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {

        //

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {

        // Validar los datos de entrada
        $request->validate([
            'start_vote' => 'date',
            'end_vote' => 'date',
            'start_moderation' => 'date',
            'end_moderation' => 'date',
            'showExplicit' => 'boolean',
            'letProposeExplicit' => 'boolean',
            'alertExplicit' => 'boolean',
            'theme' => 'string',
            'teacher_email_key' => 'string',
            'student_email_key' => 'string',
        ]);

        $setting = Setting::first();

        // Si no hay configuración existente, puedes crearla
        if (!$setting) {
            return Setting::create($request->all());
        }

        // Actualizar la configuración existente
        $setting->update($request->all());

        // Devolver la configuración actualizada como respuesta
        return response()->json($setting);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {

        $setting = Setting::findOrFail($id);
        $setting->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Setting deleted successfully'
        ]);

    }
}
