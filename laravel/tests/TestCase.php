<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\DB;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    // Setup function to create the roles
    protected function setUp(): void {
        parent::setUp();

        // Create the roles
        DB::table('roles')->insert([
            ['id' => 1, 'name' => 'Administrator'],
            ['id' => 2, 'name' => 'Moderator'],
            ['id' => 3, 'name' => 'Professor'],
            ['id' => 4, 'name' => 'Student'],
        ]);
    }
}
