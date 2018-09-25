<?php

namespace Tests\Feature\Auth;

use App\Brokers\ResetPasswordBroker;
use App\Models\ApiUser;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redis;
use Tests\ApiTestCase;

class ResetPasswordTest extends ApiTestCase
{
    /**
     * New password
     */
    protected const NEW_PASSWORD = 'new_password';

    /**
     * Test resetting password
     *
     * @return void
     */
    public function testResetPassword()
    {
        $user = factory(ApiUser::class)->create();
        $token = '12345678';
        Redis::set(ResetPasswordBroker::redisKey($user, $token), true);
        $this->assertSucceed([
            'email' => $user->email,
            'password' => $this::NEW_PASSWORD,
            'token' => $token
        ]);
        $this->assertTrue(Auth::guard('api')->attempt([
            'email' => $user->email,
            'password' => $this::NEW_PASSWORD,
        ]));
        $this->assertFailed([
            'email' => $user->email,
        ], 422);
        $this->assertFailed([
            'email' => 'wrong@foodie-connector.delivery',
            'password' => $this::NEW_PASSWORD,
            'token' => $token,
        ], 404);
        $this->assertFailed([
            'email' => $user->email,
            'password' => $this::NEW_PASSWORD,
            'token' => $token,
        ], 401);
    }

    protected function method()
    {
        return 'POST';
    }

    protected function uri()
    {
        return '/auth/reset-password';
    }

    protected function summary()
    {
        return 'Reset password';
    }

    protected function tag()
    {
        return 'authentication';
    }
}
