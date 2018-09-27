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
        $this->assertThrottle($this->assertFailed([
            'email' => 'wrong@foodie-connector.delivery',
            'password' => ApiUser::testingPassword(),
        ], 401), 5, 4);
        foreach (range(1, 5) as $i) {
            $this->assertThrottle($this->assertFailed([
                'email' => $user->email,
                'password' => 'wrong',
            ], 401, false), 5, 5 - $i);
        }
        $decayMinute = new \ReflectionClassConstant(LoginController::class, 'DECAY_MINUTES');
        $this->assertThrottle($this->assertFailed([
            'email' => $user->email,
            'password' => ApiUser::testingPassword(),
        ], 429), 5, 0, $decayMinute->getValue() * 60);
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
