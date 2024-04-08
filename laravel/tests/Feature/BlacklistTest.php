<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class BlacklistTest extends TestCase {

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

    // Helper function to insert a song into the blacklist
    private function insertSong($user, $nom, $spotify_id, $artist) {
        return $this->actingAs($user)
            ->post('/api/blacklist', [
                'spotify_id' => $spotify_id,
                'title' => $nom,
                'artist' => $artist
            ]);
    }

    public function test_insert(): void {
        // Login as admin
        $admin = $this->loginAsAdmin();

        // Insert a song into the blacklist
        $response = $this->insertSong($admin, 'song1', '1', 'artist');

        $response->assertStatus(201)
            ->assertJson([
                'spotify_id' => 1,
                'title' => 'song1',
                'artist' => 'artist'
            ]);
    }

    public function test_insert_not_admin(): void {
        // Login as a student
        $user = $this->loginAsStudent();

        // Insert a song into the blacklist
        $response = $this->insertSong($user, 'song1', '1', 'artist');

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'You do not have admin permissions.'
            ]);
    }

    public function test_index(): void {
        // Login as admin
        $admin = $this->loginAsAdmin();

        // Insert a 2 songs into the blacklist
        $this->insertSong($admin, 'song1', '1', 'artist');
        $this->insertSong($admin, 'song2', '2', 'artist');

        // Get the songs from the blacklist
        $response = $this->actingAs($admin)
            ->get('/api/blacklist');

        $response->assertStatus(200)
            ->assertJsonCount(2);
    }

    public function test_show(): void {
        // Login as admin
        $admin = $this->loginAsAdmin();

        // Insert a song into the blacklist
        $response = $this->insertSong($admin, 'song1', '1', 'artist');
        $id = $response->json('id');

        // Get the song from the blacklist
        $response = $this->actingAs($admin)
            ->get("/api/blacklist/$id");

        $response->assertStatus(200)
            ->assertJson([
                'title' => 'song1',
                'spotify_id' => '1',
            ]);
    }

    public function test_destroy(): void {
        // Login as admin
        $admin = $this->loginAsAdmin();

        // Insert a song into the blacklist
        $response = $this->insertSong($admin, 'song1', 1);
        $id = $response->json('id');

        // Delete the song from the blacklist
        $response = $this->actingAs($admin)
            ->delete("/api/blacklist/$id");

        $response->assertStatus(200);
    }

    public function test_destroy_not_admin(): void {
        // Login as admin
        $admin = $this->loginAsAdmin();

        // Insert a song into the blacklist
        $response = $this->insertSong($admin, 'song1', 1);
        $id = $response->json('id');

        // Login as a student
        $user = $this->loginAsStudent();

        // Delete the song from the blacklist
        $response = $this->actingAs($user)
            ->delete("/api/blacklist/$id");

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'You do not have admin permissions.'
            ]);
    }

    public function test_destroy_non_existent_song(): void {
        // Login as admin
        $admin = $this->loginAsAdmin();

        // Delete a non-existent song from the blacklist
        $response = $this->actingAs($admin)
            ->delete("/api/blacklist/1");

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'The song does not exist.'
            ]);
    }
}
