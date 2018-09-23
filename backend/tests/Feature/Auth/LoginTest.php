<?php

namespace Tests\Feature\Auth;

use App\Models\ApiUser;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class LoginTest extends TestCase
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
        ], 101);
        $this->assertFailed([
            'email' => 'wrong@foodie-connector.deliver',
            'password' => $this::PASSWORD,
        ], 203);
        foreach (range(1, 5) as $i) {
            $this->assertFailed([
                'email' => $this::EMAIL,
                'password' => 'wrong',
            ], 203);
        }
        $this->assertFailed([
            'email' => $this::EMAIL,
            'password' => $this::PASSWORD,
        ], 202);
    }

    protected function method()
    {
        return 'POST';
    }

    protected function uri()
    {
        return '/api/user/login';
    }
}
