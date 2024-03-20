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

        $token = $user->createToken('soundoclock')->plainTextToken;

        $response = [
            'user' => $user,
            'token' => $token
        ];

        return response($response, 201);
    }

    public function logout(Request $request) {
        auth()->user()->tokens()->delete();

        return [
            'message' => 'Logged out'
        ];
    }

    public function getUser(Request $request) {
        $user = auth()->user();
    
        if ($user) {
            return response($user, 200);
        } else {
            return response()->json([
                'error' => 'User not found'
            ], 404);
        }
    }
}
