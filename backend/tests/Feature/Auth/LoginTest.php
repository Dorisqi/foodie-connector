<?php

namespace Tests\Feature\Auth;

use App\Models\ApiUser;
use Illuminate\Support\Facades\Hash;
use Tests\ApiTestCase;

class LoginTest extends ApiTestCase
{
    const EMAIL = 'user@foodie-connector.delivery';
    const PASSWORD = 'test123456';
    const NAME = 'Test User';

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testExample()
    {
        ApiUser::create([
            'email' => $this::EMAIL,
            'password' => Hash::make($this::PASSWORD),
            'name' => $this::NAME,
        ]);
        $this->assertSucceed([
            'email' => $this::EMAIL,
            'password' => $this::PASSWORD,
        ]);
        $this->assertFailed([
            'email' => $this::EMAIL,
        ], 422);
        $this->assertFailed([
            'email' => 'wrong@foodie-connector.delivery',
            'password' => $this::PASSWORD,
        ], 401);
        foreach (range(1, 5) as $i) {
            $this->assertFailed([
                'email' => $this::EMAIL,
                'password' => 'wrong',
            ], 401, false);
        }
        $this->assertFailed([
            'email' => $this::EMAIL,
            'password' => $this::PASSWORD,
        ], 429);
    }

    protected function method()
    {
        return 'POST';
    }

    protected function uri()
    {
        return '/api/user/login';
    }

    protected function summary()
    {
        return 'Login';
    }

    protected function tag()
    {
        return 'authentication';
    }
}
