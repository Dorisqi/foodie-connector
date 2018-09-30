<?php

namespace Tests\Feature\Profile;

use App\Http\Controllers\ProfileController;
use App\Models\ApiUser;
use Tests\ApiTestCase;

class UpdateEmailTest extends ApiTestCase
{
    /**
     * Test updating email
     *
     * @return void
     */
    public function testUpdateEmail()
    {
        $this->assertFailed(null, 401);
        $user = $this->userFactory()->create();
        $this->login($user);
        $this->assertSucceed([
            'email' => 'new@foodie-connector.delivery',
        ]);
        $user = ApiUser::find($user->id);
        $this->assertTrue($user->email === 'new@foodie-connector.delivery');
        $this->userFactory()->create([
            'email' => 'exist@foodie-connector.delivery',
        ]);
        $this->assertFailed([
            'email' => 'exist@foodie-connector.delivery',
        ], 409);
        $this->assertFailed([
            'email' => 'not_email',
        ], 422);
    }

    public function method()
    {
        return 'PUT';
    }

    public function uri()
    {
        return '/profile/email';
    }

    public function summary()
    {
        return 'Update the email address';
    }

    public function tag()
    {
        return 'profile';
    }

    public function rules()
    {
        return ProfileController::updateEmailRules();
    }
}
