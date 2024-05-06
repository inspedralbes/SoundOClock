<?php

namespace App\Http\Controllers;

use App\Models\Blacklist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BlacklistController extends Controller
{
    /**
     * @OA\Get(
     *      path="/api/blacklist",
     *      operationId="getBlacklist",
     *      tags={"Blacklist"},
     *      summary="Obtener lista negra",
     *      security={{"bearer_token":{}}},
     *      description="Obtiene todas las canciones en la lista negra.",
     *      @OA\Response(
     *          response=200,
     *          description="Lista de canciones en la lista negra",
     *          @OA\JsonContent(
     *              type="array",
     *              @OA\Items(
     *                  type="object",
     *                  @OA\Property(property="id", type="integer", example=1),
     *                  @OA\Property(property="nom", type="string", example="Anaconda"),
     *                  @OA\Property(property="spotify_id", type="integer", example=1),
     *                  @OA\Property(property="created_at", type="string", format="date-time", example=null),
     *                  @OA\Property(property="updated_at", type="string", format="date-time", example=null)
     *              )
     *          )
     *      ),
     *      @OA\Response(
     *          response=401,
     *          description="Unauthorized",
     *          @OA\JsonContent(
     *              @OA\Property(property="message", type="string", example="Unauthenticated.")
     *          )
     *      ),
     *      @OA\Response(
     *          response=404,
     *          description="No tienes permisos de administrador",
     *          @OA\JsonContent(
     *              @OA\Property(property="status", type="string", example="error"),
     *              @OA\Property(property="message", type="string", example="No tienes permisos de administrador.")
     *          )
     *      )
     * )
     */
    public function index()
    {
        return Blacklist::all();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }


    /**
     * @OA\Post(
     *      path="/api/blacklist",
     *      operationId="store",
     *      tags={"Blacklist"},
     *      summary="Añadir canción a lista negra",
     *      security={{"bearer_token":{}}},
     *      description="Añade una canción a la lista negra.",
     *      @OA\RequestBody(
     *          required=true,
     *          description="Datos de la canción a añadir",
     *          @OA\MediaType(
     *              mediaType="application/x-www-form-urlencoded",
     *              @OA\Schema(
     *                  required={"nom", "spotify_id"},
     *                  @OA\Property(property="nom", type="string", description="Nombre de la canción"),
     *                  @OA\Property(property="spotify_id", type="integer", description="ID de Spotify de la canción")
     *              )
     *          )
     *      ),
     *      @OA\Response(
     *          response=201,
     *          description="Canción añadida a la lista negra",
     *          @OA\JsonContent(
     *              @OA\Property(property="nom", type="string", example="Canción de ejemplo"),
     *              @OA\Property(property="spotify_id", type="integer", example=12345)
     *          )
     *      ),
     *      @OA\Response(
     *          response=401,
     *          description="No autenticado",
     *          @OA\JsonContent(
     *              @OA\Property(property="message", type="string", example="Unauthenticated.")
     *          )
     *      ),
     *      @OA\Response(
     *          response=404,
     *          description="No tienes permisos de administrador",
     *          @OA\JsonContent(
     *              @OA\Property(property="status", type="string", example="error"),
     *              @OA\Property(property="message", type="string", example="No tienes permisos de administrador.")
     *          )
     *      )
     * )
     */
    public function store(Request $request)
    {

        // Validate the request data
        $request->validate([
            'spotify_id' => 'required|string',
            'name' => 'required|string',
            'artists' => 'required|array',
            'img' => 'string',
            'preview_url' => 'string'
        ]);

        Log::info('[DEBUG] Request data: ' . json_encode($request->all()));

        // Check that the user is an admin
        if (auth()->user()->role_id !== 1 && auth()->user()->role_id !== 2) {
            return response()->json([
                'status' => 'error',
                'message' => 'You do not have admin permissions.'
            ], 404);
        }

        $song = new Blacklist();
        $song->spotify_id = $request->spotify_id;
        $song->name = $request->name;
        $song->artists = $request->artists;
        $song->img = $request->img;
        $song->preview_url = $request->preview_url;
        $song->save();

        return response()->json($song, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {

        // Check that the user is an admin
        if (auth()->user()->role_id !== 1 && auth()->user()->role_id !== 2) {
            return response()->json([
                'status' => 'error',
                'message' => 'You do not have admin permissions.'
            ], 404);
        }

        $song = Blacklist::where('spotify_id', $id)->first();

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
     * @OA\Delete(
     *      path="/api/blacklist/{id}",
     *      operationId="deleteBlacklist",
     *      tags={"Blacklist"},
     *      summary="Eliminar canción de la lista negra",
     *      security={{"bearer_token":{}}},
     *      description="Elimina una canción específica de la lista negra.",
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          description="ID de la canción",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Canción eliminada de la lista negra",
     *          @OA\JsonContent(
     *              @OA\Property(property="id", type="integer", example=1),
     *              @OA\Property(property="nom", type="string", example="Anaconda"),
     *              @OA\Property(property="spotify_id", type="integer", example=1),
     *              @OA\Property(property="created_at", type="string", format="date-time", example="2022-03-21T12:00:00Z"),
     *              @OA\Property(property="updated_at", type="string", format="date-time", example="2022-03-21T12:00:00Z")
     *          )
     *      ),
     *      @OA\Response(
     *          response=401,
     *          description="No autenticado",
     *          @OA\JsonContent(
     *              @OA\Property(property="message", type="string", example="Unauthenticated.")
     *          )
     *      ),
     *      @OA\Response(
     *          response=404,
     *          description="Canción no encontrada o no tienes permisos de administrador",
     *          @OA\JsonContent(
     *              @OA\Property(property="status", type="string", example="error"),
     *              @OA\Property(property="message", type="string", example="La canción no existe o no tienes permisos de administrador.")
     *          )
     *      )
     * )
     */
    public function destroy($id)
    {

        // Check that the user is an admin
        if (auth()->user()->role_id !== 1 && auth()->user()->role_id !== 2) {
            return response()->json([
                'status' => 'error',
                'message' => 'You do not have admin permissions.'
            ], 404);
        }

        // Check that the song exists in the blacklist cheking the idSoptify
        $song = Blacklist::where('spotify_id', $id)->first();
        if ($song == null) {
            return response()->json([
                'status' => 'error',
                'message' => 'The song does not exist.'
            ], 404);
        }

        // Delete the song
        $song->delete();

        return response()->json($song);
    }
}
