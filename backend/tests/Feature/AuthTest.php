<?php

namespace Tests\Feature;

use Tests\TestCase;

class AuthTest extends TestCase
{
    const EMAIL = 'test@foodie-connector.com';
    const PASSWORD = 'test123456';
    const NAME = 'Test User';

    const REGISTRATION_METHOD = 'POST';
    const REGISTRATION_URI = '/api/user/register';

    /**
     * Test authentication.
     *
     * @return void
     */
    public function testAuth()
    {
        // 101 Validation Failed
        $response = $this->json($this::REGISTRATION_METHOD, $this::REGISTRATION_URI, [
            'email' => $this::EMAIL,
            'password' => 'short',
            'name' => $this::NAME,
        ]);
        $response->assertJson([
            'succeed' => false,
            'error_code' => 101,
        ]);

        // 0 Succeed
        $response = $this->json($this::REGISTRATION_METHOD, $this::REGISTRATION_URI, [
            'email' => $this::EMAIL,
            'password' => $this::PASSWORD,
            'name' => $this::NAME,
        ]);
        $response->assertJson([
            'succeed' => true,
        ]);

        // 201 Email Exists
        $response = $this->json($this::REGISTRATION_METHOD, $this::REGISTRATION_URI, [
            'email' => $this::EMAIL,
            'password' => $this::PASSWORD,
            'name' => $this::NAME,
        ]);
        $response->assertJson([
            'succeed' => false,
            'error_code' => 201,
        ]);
    }
}
