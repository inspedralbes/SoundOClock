<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Role;

class RolesTest extends TestCase {

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

    // Helper function to create a role
    private function createRole($user, $name, $description) {
        return $this->actingAs($user)
            ->post('/api/roles', [
                'name' => $name,
                'description' => $description
            ]);
    }

    public function test_insert(): void {
        // Login as admin
        $admin = $this->loginAsAdmin();

        // Create a role
        $response = $this->createRole($admin, 'role1', 'r1');

        $response->assertStatus(201)
            ->assertJson([
                'name' => 'role1',
                'description' => 'r1'
            ]);
    }

    public function test_insert_not_admin(): void {
        // Login as a student
        $student = $this->loginAsStudent();

        // Create a role
        $response = $this->createRole($student, 'role1', 'r1');

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'You do not have admin permissions.'
            ]);
    }

    public function test_index(): void {
        // Login as admin
        $admin = $this->loginAsAdmin();

        // Create a role
        $response = $this->createRole($admin, 'role1', 'r1');
        $role_id = $response->json('id');

        // Create a second role
        $response = $this->createRole($admin, 'role2', 'r2');
        $role_id2 = $response->json('id');

        // Get all roles
        $response = $this->actingAs($admin)
            ->get('/api/roles');

        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $role_id,
                'name' => 'role1',
                'description' => 'r1'
            ])
            ->assertJsonFragment([
                'id' => $role_id2,
                'name' => 'role2',
                'description' => 'r2'
            ]);
    }

    public function test_show(): void {
        // Login as admin
        $admin = $this->loginAsAdmin();

        // Create a role
        $response = $this->createRole($admin, 'role1', 'r1');
        $role_id = $response->json('id');

        // Get the role
        $response = $this->actingAs($admin)
            ->get("/api/roles/$role_id");

        $response->assertStatus(200)
            ->assertJson([
                'id' => $role_id,
                'name' => 'role1',
                'description' => 'r1'
            ]);
    }

    public function test_update(): void {
        // Login as admin
        $admin = $this->loginAsAdmin();

        // Create a role
        $response = $this->createRole($admin, 'role1', 'r1');
        $role_id = $response->json('id');

        // Update the role
        $response = $this->actingAs($admin)
            ->put("/api/roles/$role_id", [
                'name' => 'role2',
                'description' => 'r2'
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'id' => $role_id,
                'name' => 'role2',
                'description' => 'r2'
            ]);
    }

    public function test_update_not_admin(): void {
        // Login as an admin
        $admin = $this->loginAsAdmin();

        // Create a role
        $response = $this->createRole($admin, 'role1', 'r1');
        $role_id = $response->json('id');

        // Login as a student
        $student = $this->loginAsStudent();

        // Update the role
        $response = $this->actingAs($student)
            ->put("/api/roles/$role_id", [
                'name' => 'role2',
                'description' => 'r2'
            ]);

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'You do not have admin permissions.'
            ]);
    }

    public function test_destroy(): void {
        // Login as admin
        $admin = $this->loginAsAdmin();

        // Create a role
        $response = $this->createRole($admin, 'role1', 'r1');
        $role_id = $response->json('id');

        // Delete the role
        $response = $this->actingAs($admin)
            ->delete("/api/roles/$role_id");

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Role deleted successfully'
            ]);
    } 

    public function test_destroy_not_admin(): void {
        // Login as admin
        $admin = $this->loginAsAdmin();

        // Create a role
        $response = $this->createRole($admin, 'role1', 'r1');
        $role_id = $response->json('id');

        // Login as a student
        $student = $this->loginAsStudent();

        // Delete the role
        $response = $this->actingAs($student)
            ->delete("/api/roles/$role_id");

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'You do not have admin permissions.'
            ]);
    }

    public function test_destroy_non_existent_role(): void {
        // Login as admin
        $admin = $this->loginAsAdmin();

        // Delete a non-existent role
        $response = $this->actingAs($admin)
            ->delete("/api/roles/100");

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'Role not found'
            ]);
    }

}
