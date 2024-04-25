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
        // Create a group category
        $response = $this->actingAs($user)
            ->post('/api/groupCategories', [
                'name' => 'category1',
                'abbreviation' => 'c1',
                'is_public' => 1,
            ]);
        $category_id = $response->json('id');
        // Create a group
        return $this->actingAs($user)
            ->post('/api/groups', [
                'name' => $name,
                'abbreviation' => $abbreviation,
                'is_public' => $is_public,
                'category_id' => $category_id,
            ]);
    }

    public function test_add_one_group_to_user(): void {
        // Login as a normal user
        $user = $this->loginAsAdmin();

        // Create a group
        $response = $this->createGroup($user, 'group1', 'g1', 1);
        $group_id = $response->json('id');

        // Create the groups array with the group id. Add to the body the user id
        $body = [
            'groups' => [ $group_id ],
            'user_id' => $user->id,
        ];

        // Directly use the $groups array as the request body
        $response = $this->actingAs($user)
            ->json('POST', "/api/groupsUser", $body);


        // Assert that the response has status 200 and the json response is an array with the group id and course
        $response->assertStatus(200)->assertJson([
            'groups' => [
                [
                    "pivot" => [
                        "user_id" => $user->id,
                        "group_id" => $group_id,
                    ],
                ],
            ]
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

        // Create the body
        $body = [
            'groups' => [ $group_id1, $group_id2, $group_id3 ],
            'user_id' => $user->id,
        ];

        // Call the endpoint
        $response = $this->actingAs($user)
            ->json('POST', "/api/groupsUser", $body);

        // Assert that the response has status 200 and the json response is an array with the group id and course
        $response->assertStatus(200)->assertJson([
            'groups' => [
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
            ]
        ]);
    }

    public function test_index_groups_from_user(): void {
        // Login as a normal user
        $user = $this->loginAsAdmin();

        // Create a group
        $response = $this->createGroup($user, 'group1', 'g1', 1);
        $group_id = $response->json('id');

        // Create the body
        $body = [
            'groups' => [ $group_id ],
            'user_id' => $user->id,
        ];

        // Add group to the user
        $response = $this->actingAs($user)
            ->json('POST', "/api/groupsUser", $body);

        // Get the groups from the user
        $response = $this->actingAs($user)
            ->get("/api/groupsUser/$user->id");
        
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

        // Create the body
        $body = [
            'groups' => [ $group_id ],
            'user_id' => $user->id,
        ];

        // Add group to the user
        $response = $this->actingAs($user)
            ->json('POST', "/api/groupsUser", $body);

        // Create a group
        $response = $this->createGroup($user, 'group2', 'g2', 1);
        $group_id2 = $response->json('id');

        // Create the body
        $body = [
            'groups' => [ $group_id2 ],
        ];

        // Update the groups from the user
        $response = $this->actingAs($user)
            ->json('PUT', "/api/groupsUser/{$user->id}", $body);

        $response->assertStatus(200)->assertJson([
            'groups' => [
                [
                    "pivot" => [
                        "user_id" => $user->id,
                        "group_id" => $group_id2,
                    ],
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

        // Create the body
        $body = [
            'groups' => [ $group_id ],
            'user_id' => $user->id,
        ];

        // Add group to the user
        $response = $this->actingAs($user)
            ->json('POST', "/api/groupsUser", $body);

        // Remove the groups from the user
        $response = $this->actingAs($user)
            ->delete("/api/groupsUser/$user->id");

        $response->assertStatus(200);

        // Get groups from the user
        $response = $this->actingAs($user)
            ->get("/api/groupsUser/$user->id");

        // Assert that the user has no groups
        $response->assertStatus(200)->assertJson([]);
    }

}
