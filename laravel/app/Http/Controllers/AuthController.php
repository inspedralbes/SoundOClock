<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller {
     

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
    public function login(Request $request) {
        $fields = $request->validate([
            'email' => 'required|string',
            'name' => 'required|string',
        ]);

        // check if mail exists and if not exist create a new user
        $user = User::firstOrCreate([
            'email' => $fields['email'],
            'name' => $fields['name'],
        ]);

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
    public function logout(Request $request) {
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
    public function getUser(Request $request) {
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

    public function index() {
        return User::with('groups')->get();
    }

    public function show($id) {

        // Validar que l'usuari sigui administrador
        if (auth()->user()->role_id !== 1) {
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

    public function update(Request $request, $id) {

        // Validar que l'usuari sigui administrador
        if (auth()->user()->role_id !== 1) {
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

        // Update user
        $user->update([
            'vote_banned_until' => $request->input('vote_banned_until'),
            'propose_banned_until' => $request->input('propose_banned_until'),
        ]);

        return response()->json($user);
    }
}
