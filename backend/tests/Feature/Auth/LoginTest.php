<?php

namespace Tests\Feature\Auth;

use App\Http\Controllers\Auth\LoginController;
use App\Models\ApiUser;
use Tests\ApiTestCase;

class LoginTest extends ApiTestCase
{

    /**
     * Test login
     *
     * @return void
     *
     * @throws \ReflectionException
     */
    public function testLogin()
    {
        $user = $this->userFactory()->create();
        $this->assertSucceed([
            'email' => $user->email,
            'password' => ApiUser::testingPassword(),
        ]);
        $this->assertAuthenticatedAs($user, 'api');
        $this->assertFailed([
            'email' => $user->email,
        ], 422);
        $rateLimitReflection = new \ReflectionClassConstant(LoginController::class, 'RATE_LIMIT');
        $rateLimit = $rateLimitReflection->getValue();
        $decayMinuteReflection = new \ReflectionClassConstant(LoginController::class, 'DECAY_MINUTES');
        $decayMinute = $decayMinuteReflection->getValue();
        foreach (range(1, 6) as $i) {
            $this->assertThrottle(
                $this->assertFailed([
                    'email' => $user->email,
                    'password' => 'wrong',
                ], $i <= $rateLimit ? 401 : 429, $i == 1 || $i == 6),
                $rateLimit,
                $i <= $rateLimit ? $rateLimit - $i : 0,
                $i >= $rateLimit ? $decayMinute * 60 : null
            );
        }
    }

    protected function method()
    {
        return 'POST';
    }

    protected function uri()
    {
        return '/auth/login';
    }

    protected function summary()
    {
        return 'Login';
    }

    protected function tag()
    {
        return 'authentication';
    }

    protected function rules()
    {
        return LoginController::rules();
    }
}
