<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Bell;
use App\Models\User;

class BellsTest extends TestCase {

    use RefreshDatabase;

    // Helper function to login as admin
    private function loginAsAdmin() {
        $user = User::factory()->create([
            'name' => 'admin',
            'email' => 'admin@gmail.com',
            'role_id' => 1
        ]);
        return $user;
    }

    // Helper function to login as a student
    private function loginAsStudent() {
        $user = User::factory()->create([
            'name' => 'santi',
            'email' => 'santi@gmail.com',
            'role_id' => 4
        ]);
        return $user;
    }

    // Helper function to create a bell
    private function createBell($user, $hour) {
        return $this->actingAs($user)
            ->post('/api/bells', [
                'hour' => $hour,
            ]);
    }

    public function test_insert(): void {
        // Login as admin
        $admin = $this->loginAsAdmin();

        // Create a group
        $response = $this->createBell($admin, '12:00:00');

        $response->assertStatus(201)
            ->assertJson([
                'hour' => '12:00:00'
            ]);
    }

    public function test_insert_not_admin(): void {
        // Login as a student
        $user = $this->loginAsStudent();

        // Create a group
        $response = $this->createBell($user, '12:00:00');

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'You do not have admin permissions.'
            ]);
    }

    public function test_index(): void {
        // Login as admin
        $admin = $this->loginAsAdmin();

        // Create 2 bells
        $this->createBell($admin, '12:00:00');
        $this->createBell($admin, '13:00:00');

        // Get all groups
        $response = $this->actingAs($admin)
            ->get('/api/bells');

        $response->assertStatus(200)
            ->assertJsonCount(2);
    }

}
