<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;

class GroupsUserTest extends TestCase {

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
    
    // Helper function to create a group
    private function createGroup($user, $name, $abbreviation, $is_public) {
        return $this->actingAs($user)
            ->post('/api/groups', [
                'name' => $name,
                'abbreviation' => $abbreviation,
                'is_public' => $is_public
            ]);
    }

    public function test_add_one_group_to_user(): void {
        // Login as a normal user
        $user = $this->loginAsAdmin();

        // Create a group
        $response = $this->createGroup($user, 'group1', 'g1', 1);
        $group_id = $response->json('id');

        // Add group to an aray
        $groups = [$group_id];

        // Add the group to the user
        $response = $this->actingAs($user)
            ->post("/api/addGroupsToUser/$user->id", [
                'groups' => $groups
            ]);

        $response->assertStatus(200)->assertJson([
            [
                "pivot" => [
                    "user_id" => $user->id,
                    "group_id" => $group_id,
                ],
            ],
        ]);
    }

    public function test_add_three_groups_to_user(): void {
        // Login as a normal user
        $user = $this->loginAsAdmin();

        // Create a group
        $response = $this->createGroup($user, 'group1', 'g1', 1);
        $group_id1 = $response->json('id');

        // Create a group
        $response = $this->createGroup($user, 'group2', 'g2', 1);
        $group_id2 = $response->json('id');

        // Create a group
        $response = $this->createGroup($user, 'group3', 'g3', 1);
        $group_id3 = $response->json('id');

        // Add group to an aray
        $groups = [$group_id1, $group_id2, $group_id3];

        // Add the groups to the user
        $response = $this->actingAs($user)
            ->post("/api/addGroupsToUser/$user->id", [
                'groups' => $groups
            ]);

        $response->assertStatus(200)->assertJson([
            [
                "pivot" => [
                    "user_id" => $user->id,
                    "group_id" => $group_id1,
                ],
            ],
            [
                "pivot" => [
                    "user_id" => $user->id,
                    "group_id" => $group_id2,
                ],
            ],
            [
                "pivot" => [
                    "user_id" => $user->id,
                    "group_id" => $group_id3,
                ],
            ],
        ]);
    }

    public function test_index_groups_from_user(): void {
        // Login as a normal user
        $user = $this->loginAsAdmin();

        // Create a group
        $response = $this->createGroup($user, 'group1', 'g1', 1);
        $group_id = $response->json('id');

        // Add group to an aray
        $groups = [$group_id];

        // Add the group to the user
        $response = $this->actingAs($user)
            ->post("/api/addGroupsToUser/$user->id", [
                'groups' => $groups
            ]);

        // Get the groups from the user
        $response = $this->actingAs($user)
            ->get("/api/getGroupsFromUser/$user->id");

        $response->assertStatus(200)->assertJson([
            [
                "id" => $group_id,
                "name" => "group1",
                "abbreviation" => "g1",
                "is_public" => 1,
            ],
        ]);
    }

    public function test_update_groups_to_user(): void {
        // Login as a normal user
        $user = $this->loginAsAdmin();

        // Create a group
        $response = $this->createGroup($user, 'group1', 'g1', 1);
        $group_id = $response->json('id');

        // Add group to an aray
        $groups = [$group_id];

        // Add the group to the user
        $this->actingAs($user)
            ->post("/api/addGroupsToUser/$user->id", [
                'groups' => $groups
            ]);

        // Create a group
        $response = $this->createGroup($user, 'group2', 'g2', 1);
        $group_id2 = $response->json('id');

        // Add group to an aray
        $groups = [$group_id2];

        // Update the groups from the user
        $response = $this->actingAs($user)
            ->put("/api/updateGroupsToUser/$user->id", [
                'groups' => $groups
            ]);

        $response->assertStatus(200)->assertJson([
            [
                "pivot" => [
                    "user_id" => $user->id,
                    "group_id" => $group_id2,
                ],
            ],
        ]);
    }

    public function test_remove_groups_from_user(): void {
        // Login as a normal user
        $user = $this->loginAsAdmin();

        // Create a group
        $response = $this->createGroup($user, 'group1', 'g1', 1);
        $group_id = $response->json('id');

        // Add group to an aray
        $groups = [$group_id];

        // Add the group to the user
        $this->actingAs($user)
            ->post("/api/addGroupsToUser/$user->id", [
                'groups' => $groups
            ]);

        // Remove the groups from the user
        $response = $this->actingAs($user)
            ->delete("/api/removeGroupsFromUser/$user->id");

        $response->assertStatus(200);

        // Get groups from the user
        $response = $this->actingAs($user)
            ->get("/api/getGroupsFromUser/$user->id");
        
        // Assert that the user has no groups
        $response->assertStatus(200)->assertJson([]);
    }

}
