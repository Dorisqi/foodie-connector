<?php

namespace Tests\Feature\Auth;

use App\Http\Controllers\Auth\RegisterController;
use App\Models\ApiUser;
use Illuminate\Support\Facades\Auth;
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
        $user = factory(ApiUser::class)->make();
        $this->assertFailed([
            'email' => $user->email,
            'password' => 'short',
            'name' => $user->name,
        ], 422);
        $this->assertSucceed([
            'email' => $user->email,
            'password' => ApiUser::testingPassword(),
            'name' => $user->name,
        ]);
        $this->assertTrue(Auth::guard('api')->attempt([
            'email' => $user->email,
            'password' => ApiUser::testingPassword(),
        ]));
        $this->assertFailed([
            'email' => $user->email,
            'password' => ApiUser::testingPassword(),
            'name' => $user->name,
        ], 409);
    }

    protected function method()
    {
        return 'POST';
    }

    protected function uri()
    {
        return '/auth/register';
    }

    protected function summary()
    {
        return 'Register for a new user';
    }

    protected function tag()
    {
        return 'authentication';
    }

    protected function controller()
    {
        return RegisterController::class;
    }
}
