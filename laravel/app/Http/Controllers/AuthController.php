<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Ban;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\bannedUserEmail;

class AuthController extends Controller
{


    /**
     * @OA\Post(
     *     path="/api/login",
     *     operationId="login",
     *     tags={"Authentication"},
     *     summary="User login",
     *     description="Logs in a user with email and name.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/x-www-form-urlencoded",
     *             @OA\Schema(
     *                 required={"email", "name"},
     *                 @OA\Property(property="email", type="string", format="email", example="user@example.com"),
     *                 @OA\Property(property="name", type="string", example="John Doe")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="User logged in successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="token", type="string", example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="The given data was invalid."),
     *             @OA\Property(property="errors", type="object", example={"email": {"The email field is required."}})
     *         )
     *     )
     * )
     */
    public function login(Request $request)
    {

        $emails = ['a20miqmorcho@inspedralbes.cat', 'a23alvkumrom@inspedralbes.cat', 'a22sanpujsau@inspedralbes.cat', '20davsalsos@inspedralbes.cat', 'a22rauespgom@inspedralbes.cat'];

        $fields = $request->validate([
            'email' => 'required|string',
            'name' => 'required|string',
            'picture' => 'sometimes|string',
        ]);

        // check if mail exists
        $user = User::where('email', $fields['email'])->first();

        if (!$user) {

            if (in_array($fields['email'], $emails)) {
                $role = 1;
            } elseif (preg_match('/[0-9]/', $fields['email'])) {
                $role = 4;
            } else {
                $role = 3;
            }

            $user = User::create([
                'email' => $fields['email'],
                'name' => $fields['name'],
                'picture' => $fields['picture'] ?? null,
                'role_id' => $role,
            ]);
        } elseif ($user->picture == null && $fields['picture'] != null) {
            $user->update([
                'picture' => $fields['picture']
            ]);
        }

        $user->load('groups');

        $token = $user->createToken('soundoclock')->plainTextToken;

        $response = [
            'user' => $user,
            'token' => $token
        ];

        return response($response, 201);
    }

    /**
     * @OA\Post(
     *     path="/api/logout",
     *     operationId="logout",
     *     tags={"Authentication"},
     *     summary="User logout",
     *     description="Logs out the authenticated user by deleting all access tokens. Requires a bearer token for authentication.",
     *      security={{"bearer_token":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Successfully logged out",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Logged out")
     *         )
     *     )
     * )
     */
    public function logout(Request $request)
    {
        auth()->user()->tokens()->delete();

        return [
            'message' => 'Logged out'
        ];
    }

    /**
     * @OA\Get(
     *     path="/api/getUser",
     *     operationId="getUser",
     *     tags={"Authentication"},
     *     summary="Get user information",
     *     description="Retrieves information about the authenticated user.",
     *     security={{"bearer_token":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="User information retrieved successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="name", type="string", example="John Doe"),
     *             @OA\Property(property="email", type="string", example="john@example.com"),
     *             @OA\Property(property="created_at", type="string", format="date-time", example="2022-03-19T12:00:00Z"),
     *             @OA\Property(property="updated_at", type="string", format="date-time", example="2022-03-19T12:00:00Z")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="User not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="error", type="string", example="User not found")
     *         )
     *     )
     * )
     */
    public function getUser(Request $request)
    {
        $user = auth()->user();

        if ($user) {
            $user->load('groups');
            return response($user, 200);
        } else {
            return response()->json([
                'error' => 'User not found'
            ], 404);
        }
    }

    public function index()
    {
        return User::with('groups', 'bans')->get();
    }

    public function indexUsers(Request $request)
    {

        // $request->validate([
        //     'users' => 'required|array',
        // ]);

        // Obtener el array de IDs de usuarios desde la solicitud
        $ids = $request->input('users.*.userId');

        // Buscar los usuarios en base a los IDs proporcionados
        $users = User::whereIn('id', $ids)->get();

        // Devolver los usuarios como un array JSON
        return response()->json(['users' => $users]);
    }

    public function show($id)
    {

        // Validar que l'usuari sigui administrador
        if (auth()->user()->role_id !== 1 && auth()->user()->role_id !== 2) {
            return response()->json([
                'status' => 'error',
                'message' => 'No tens permisos d\'administrador.'
            ], 404);
        }

        // Find user
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'L\'usuari no existeix.'
            ], 404);
        }

        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        // Validar que el usuario sea administrador
        if (auth()->user()->role_id !== 1 && auth()->user()->role_id !== 2) {
            return response()->json([
                'status' => 'error',
                'message' => 'No tienes permisos de administrador.'
            ], 404);
        }

        // Buscar usuario
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'El usuario no existe.'
            ], 404);
        }

        // Iniciar la transacción
        DB::beginTransaction();

        try {
            // Si el usuario está siendo suspendido...
            if (($request->input('vote_banned_until') !== null && $user->vote_banned_until != $request->input('vote_banned_until')) || ($request->input('propose_banned_until') !== null && $user->propose_banned_until != $request->input('propose_banned_until'))) {
                // Crear un nuevo registro en la tabla bans
                $ban = new Ban();

                if ($request->input('vote_banned_until') !== null && $user->vote_banned_until != $request->input('vote_banned_until')) {
                    $ban->forVoting = 1;
                    $ban->banned_until = $request->input('vote_banned_until');
                } else {
                    $ban->forVoting = 0;
                    $ban->banned_until = $request->input('propose_banned_until');
                }

                $ban->banned_from = date("Y/m/d");
                $ban->user_id = $user->id;
                $ban->save();
            }

            // Actualizar usuario
            $user->update([
                'role_id' => $request->input('role_id'),
                'vote_banned_until' => $request->input('vote_banned_until'),
                'propose_banned_until' => $request->input('propose_banned_until'),
            ]);

            // Confirmar la transacción si todo es exitoso
            DB::commit();

            if ($ban) {
                Mail::to($user->email)->send(new bannedUserEmail($user, $ban));
            }

            return response()->json($user->load('bans'));
        } catch (\Exception $e) {
            // Deshacer la transacción en caso de error
            DB::rollback();

            return response()->json([
                'status' => 'error',
                'message' => 'Se produjo un error. Transacción deshecha.',
                'error' => $e->getMessage(),
                'request' => $request->all()
            ], 500);
        }
    }
}
