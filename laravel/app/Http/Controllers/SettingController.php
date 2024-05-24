<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Setting;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\newThemeEmail;
use App\Models\Bell;

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
            return response()->json(['message' => 'Ya existe una configuración en la base de datos'], 400);
        }

        $request->validate([
            'voteDuration' => 'integer',
            'start_vote' => 'date|nullable',
            'end_vote' => 'date|nullable',
            'moderationDuration' => 'integer',
            'start_moderation' => 'date|nullable',
            'end_moderation' => 'date|nullable',
            'theme' => 'string' | 'nullable',
            'themeDesc' => 'string' | 'nullable',
            'showExplicit' => 'boolean',
            'letProposeExplicit' => 'boolean',
            'alertExplicit' => 'boolean',
        ]);

        return Setting::create($request->all());

    }

    /**
     * Display the specified resource.
     */
    public function show()
    {
        $setting = Setting::first();


        // dd($setting);

        if ($setting === null) {
            return response()->json(['message' => 'No existe una configuración en la base de datos'], 404);
        }

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
            'voteDuration' => 'integer',
            'start_vote' => 'date|nullable',
            'end_vote' => 'date|nullable',
            'moderationDuration' => 'integer',
            'start_moderation' => 'date|nullable',
            'end_moderation' => 'date|nullable',
            'theme' => 'string' | 'nullable',
            'themeDesc' => 'string' | 'nullable',
            'showExplicit' => 'boolean',
            'letProposeExplicit' => 'boolean',
            'alertExplicit' => 'boolean',
        ]);

        $settingArray = DB::select('SELECT * FROM settings LIMIT 1');

        if (empty($settingArray)) {
            $users = User::all();
            $bells = Bell::all();
            foreach ($users as $user) {
                Mail::to($user->email)->send(new newThemeEmail($user, $request->settings['start_vote'], $request->settings['end_vote'], $request->settings['theme'], $request->selectedSongs, $bells));
            }
            return Setting::create($request->settings);
        }

        if ($settingArray[0]->theme !== $request->settings['theme']) {
            $users = User::all();
            $bells = Bell::all();
            foreach ($users as $user) {
                Mail::to($user->email)->send(new newThemeEmail($user, $request->settings['start_vote'], $request->settings['end_vote'], $request->settings['theme'], $request->selectedSongs, $bells));
            }
        }

        $setting = Setting::find($settingArray[0]->id);


        // Actualizar la configuración existente
        $setting->update($request->settings);

        // Devolver la configuración actualizada como respuesta
        return response()->json($setting, 200);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {

        $setting = Setting::findOrFail($id);
        $setting->delete();
        return response()->json([
            'message'=> 'Configuración eliminada correctamente',
        ],200);

    }
}
