<?php

namespace Tests\Feature\Auth;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class RegisterTest extends TestCase
{
    protected const EMAIL = 'user@foodie-connector.deliver';
    protected const PASSWORD = 'test123456';
    protected const NAME = 'Test User';

    /**
     * Register test
     *
     * @return void
     */
    public function testRegister()
    {
        $this->assertFailed([
            'email' => $this::EMAIL,
            'password' => 'short',
            'name' => $this::NAME,
        ], 101);
        $this->assertSucceed([
            'email' => $this::EMAIL,
            'password' => $this::PASSWORD,
            'name' => $this::NAME,
        ]);
        $this->assertFailed([
            'email' => $this::EMAIL,
            'password' => $this::PASSWORD,
            'name' => $this::NAME,
        ], 201);
    }

    protected function method()
    {
        return 'POST';
    }

    protected function uri()
    {
        return '/api/user/register';
    }
}
