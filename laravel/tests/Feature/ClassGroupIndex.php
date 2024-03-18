<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ClassGroupIndex extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_ClassGroupIndex_returns_class_groups(): void
    {
        $response = $this->get('/api/classgroups/');

        $response->assertStatus(200)
            ->assertJsonStructure([
                '*' => [
                    'id',
                    'name',
                    'is_public'
                ],
            ]);
    }
}
