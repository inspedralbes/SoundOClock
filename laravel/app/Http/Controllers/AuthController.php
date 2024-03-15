<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller {
    // public function register(Request $request) {
    //     $fields = $request->validate([
    //         'name' => 'required|string',
    //         'email' => 'required|string|unique:users,email',
    //         'password' => 'required|string|confirmed',
    //     ]);

    //     $user = User::create([
    //         'name' => $fields['name'],
    //         'email' => $fields['email'],
    //         'password' => bcrypt($fields['password']),
    //     ]);

    //     $token = $user->createToken('soundoclock')->plainTextToken;

    //     $response = [
    //         'user' => $user,
    //         'token' => $token
    //     ];

    //     return response($response, 201);
    // }


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
