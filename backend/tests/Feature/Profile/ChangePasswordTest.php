<?php

namespace Tests\Feature\Profile;

use App\Http\Controllers\ProfileController;
use App\Models\ApiUser;
use Tests\ApiTestCase;

class ChangePasswordTest extends ApiTestCase
{
    /**
     * New password
     */
    protected const NEW_PASSWORD = 'new123456';

    /**
     * Test changing password
     *
     * @return void
     */
    public function testChangePassword()
    {
        $this->assertFailed(null, 401, false);
        $user = $this->userFactory()->create();
        $this->login($user);
        $this->assertSucceed([
            'old_password' => ApiUser::testingPassword(),
            'new_password' => $this::NEW_PASSWORD,
        ]);
        $this->assertTrue($this->guard()->getProvider()->validateCredentials($user, [
            'password' => $this::NEW_PASSWORD,
        ]));
        $this->assertFailed([
            'old_password' => ApiUser::testingPassword(),
            'new_password' => 'short',
        ], 422);
        $this->assertFailed([
            'old_password' => 'wrong',
            'new_password' => $this::NEW_PASSWORD,
        ], 422);
    }

    protected function method()
    {
        return 'PUT';
    }

    protected function uri()
    {
        return '/profile/password';
    }

    protected function summary()
    {
        return 'Change the password';
    }

    protected function tag()
    {
        return 'profile';
    }

    protected function rules()
    {
        return ProfileController::changePasswordRules();
    }
}
