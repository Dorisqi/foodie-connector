<?php

namespace Tests\Feature\Auth;

use App\Brokers\ResetPasswordBroker;
use App\Http\Controllers\Auth\ResetPasswordController;
use Illuminate\Support\Facades\Redis;
use Tests\ApiTestCase;

class ResetPasswordTest extends ApiTestCase
{
    /**
     * New password
     */
    protected const NEW_PASSWORD = 'new123456';

    /**
     * Test resetting password
     *
     * @return void
     */
    public function testResetPassword()
    {
        $user = $this->userFactory()->create();
        $token = '12345678';
        Redis::set(ResetPasswordBroker::redisKey($user, $token), true);
        $this->assertSucceed([
            'email' => $user->email,
            'password' => $this::NEW_PASSWORD,
            'token' => $token
        ]);
        $this->assertAuthenticatedAs($user, 'api');
        $this->guard()->getProvider()->validateCredentials($user, [
            'password' => $this::NEW_PASSWORD,
        ]);
        $this->assertFailed([
            'email' => $user->email,
        ], 422);
        $this->assertFailed([
            'email' => 'wrong@foodie-connector.delivery',
            'password' => $this::NEW_PASSWORD,
            'token' => $token,
        ], 404);
        $rateLimitReflection = new \ReflectionClassConstant(ResetPasswordController::class, 'RATE_LIMIT');
        $rateLimit = $rateLimitReflection->getValue();
        $decayMinutesReflection = new \ReflectionClassConstant(ResetPasswordController::class, 'DECAY_MINUTES');
        $decayMinutes = $decayMinutesReflection->getValue();
        foreach (range(1, $rateLimit + 1) as $i) {
            $this->assertThrottle(
                $this->assertFailed([
                    'email' => $user->email,
                    'password' => $this::NEW_PASSWORD,
                    'token' => $token,
                ], $i <= $rateLimit ? 401 : 429, $i == 1 || $i == $rateLimit + 1),
                $rateLimit,
                $i <= $rateLimit ? $rateLimit - $i : 0,
                $i >= $rateLimit ? $decayMinutes * 60 : null
            );
        }
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

    protected function rules()
    {
        return ResetPasswordController::rules();
    }
}
