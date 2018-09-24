<?php

namespace Tests\Feature\Auth;

use Tests\ApiTestCase;

class RegisterTest extends ApiTestCase
{
    protected const EMAIL = 'user@foodie-connector.delivery';
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
        ], 422);
        $this->assertSucceed([
            'email' => $this::EMAIL,
            'password' => $this::PASSWORD,
            'name' => $this::NAME,
        ]);
        $this->assertFailed([
            'email' => $this::EMAIL,
            'password' => $this::PASSWORD,
            'name' => $this::NAME,
        ], 409);
    }

    protected function method()
    {
        return 'POST';
    }

    protected function uri()
    {
        return '/api/user/register';
    }

    protected function summary()
    {
        return 'Register for a new user';
    }

    protected function tag()
    {
        return 'authentication';
    }
}
