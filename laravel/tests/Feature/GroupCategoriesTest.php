<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;

class GroupCategoriesTest extends TestCase {

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

    // Helper function to create a group
    private function createGroupCategory($user, $name, $abbreviation, $is_public) {
        return $this->actingAs($user)
            ->post('/api/groupCategories', [
                'name' => $name,
                'abbreviation' => $abbreviation,
                'is_public' => $is_public,
            ]);
    }

    public function test_insert(): void {
        // Login as admin
        $admin = $this->loginAsAdmin();

        // Create a group
        $response = $this->createGroupCategory($admin, 'groupCategory1', 'gc1', 1);

        $response->assertStatus(201)
            ->assertJson([
                'name' => 'groupCategory1',
                'abbreviation' => 'gc1',
                'is_public' => 1,
            ]);
    }

    public function test_insert_not_admin(): void {
        // Login as a student
        $user = $this->loginAsStudent();

        // Create a group
        $response = $this->createGroupCategory($user, 'groupCategory1', 'gc1', 1);

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'You do not have admin permissions.'
            ]);
    }

    public function test_index_all_public(): void {
        // Login as admin
        $admin = $this->loginAsAdmin();

        // Create 2 groups (both public)
        $response = $this->createGroupCategory($admin, 'groupCategory1', 'gc1', 1);
        $response = $this->createGroupCategory($admin, 'groupCategory2', 'gc2', 0);

        // Get all groups
        $response = $this->actingAs($admin)
            ->get('/api/groupCategories');

        $response->assertStatus(200)
            ->assertJsonCount(1);
    }

    public function test_index_private_groups(): void {
        // Login as admin
        $admin = $this->loginAsAdmin();

        // Create 2 groups (1 public and 1 private)
        $response = $this->createGroupCategory($admin, 'groupCategory1', 'gc1', 1);
        $response = $this->createGroupCategory($admin, 'groupCategory2', 'gc2', 0);

        // Get all groups
        $response = $this->actingAs($admin)
            ->get('/api/groupCategoriesAll');

        $response->assertStatus(200)
            ->assertJsonCount(2);
    }

    public function test_show(): void {
        // Login as admin
        $admin = $this->loginAsAdmin();

        // Create a group
        $response = $this->createGroupCategory($admin, 'groupCategory1', 'gc1', 1);
        $id = $response->json('id');

        // Get the group
        $response = $this->actingAs($admin)
            ->get("/api/groupCategories/$id");
 
        $response->assertStatus(200)
            ->assertJson([
                'name' => 'groupCategory1',
                'abbreviation' => 'gc1',
                'is_public' => 1,
            ]);
    }

    public function test_update(): void {
        // Login as admin
        $admin = $this->loginAsAdmin();

        // Create a group
        $response = $this->createGroupCategory($admin, 'groupCategory1', 'gc1', 1);
        $id = $response->json('id');

        // Update the group
        $response = $this->actingAs($admin)
            ->put("/api/groupCategories/$id", [
                'name' => 'groupCategory2',
                'abbreviation' => 'gc2',
                'is_public' => 0,
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'name' => 'groupCategory2',
                'abbreviation' => 'gc2',
                'is_public' => 0,
            ]);
    }

    public function test_update_not_admin(): void {
        // Login as admin
        $admin = $this->loginAsAdmin();

        // Create a group
        $response = $this->createGroupCategory($admin, 'groupCategory1', 'gc1', 1);
        $id = $response->json('id');

        // Login as a student
        $user = $this->loginAsStudent();

        // Update the group
        $response = $this->actingAs($user)
            ->put("/api/groups/$id", [
                'name' => 'groupCategory2',
                'abbreviation' => 'gc2',
                'is_public' => 0,
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

        // Create a group
        $response = $this->createGroupCategory($admin, 'groupCategory1', 'gc1', 1);
        $id = $response->json('id');

        // Delete the group
        $response = $this->actingAs($admin)
            ->delete("/api/groupCategories/$id");

        $response->assertStatus(200);
    }

    public function test_destroy_not_admin(): void {
        // Login as admin
        $admin = $this->loginAsAdmin();

        // Create a group
        $response = $this->createGroupCategory($admin, 'groupCategory1', 'gc1', 1);
        $id = $response->json('id');

        // Login as a student
        $user = $this->loginAsStudent();

        // Delete the group
        $response = $this->actingAs($user)
            ->delete("/api/groups/$id");

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'You do not have admin permissions.'
            ]);
    }

    public function test_destroy_non_existent_group(): void {
        // Login as admin
        $admin = $this->loginAsAdmin();

        // Delete a group that does not exist
        $response = $this->actingAs($admin)
            ->delete("/api/groups/1");

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'The group does not exist.'
            ]);
    }

}
