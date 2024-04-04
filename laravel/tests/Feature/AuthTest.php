<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AuthTest extends TestCase {

    use RefreshDatabase;

    public function test_login(): void {
        // Login
        $response = $this->post('/api/login', [
            'email' => 'santi@gmail.com',
            'name' => 'Santi'  
        ]);

        // Check if the response is correct
        $response->assertStatus(400)
            ->assertJsonStructure([
                'user' => [
                    'id',
                    'name',
                    'email',
                    'created_at',
                    'updated_at',
                ],
                'token'
            ]);
    }

    public function test_logout(): void {
        // Login first
        $response = $this->post('/api/login', [
            'email' => 'santi@gmail.com',
            'name' => 'Santi'
        ]);
        $token = $response->json('token');

        // Logout
        $response = $this->withHeader('Authorization', "Bearer $token")
            ->post('/api/logout');

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Logged out'
            ]);
    }

    public function test_getUser(): void {
        // Login first
        $response = $this->post('/api/login', [
            'email' => 'santi@gmail.com',
            'name' => 'Santi'
        ]);
        $token = $response->json('token');

        // Get user
        $response = $this->withHeader('Authorization', "Bearer $token")
            ->get('/api/getUser');
        
        $response->assertStatus(200)
            ->assertJsonStructure([
                'id',
                'name',
                'email',
                'created_at',
                'updated_at',
                'role_id',
            ]);
    }
}
