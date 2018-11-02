<?php

namespace Tests\Feature\Profile;

use App\Http\Controllers\ProfileController;
use App\Models\ApiUser;
use Tests\ApiTestCase;

class UpdateProfileTest extends ApiTestCase
{
    /**
     * Test updating profile
     *
     * @return void
     */
    public function testUpdateProfile()
    {
        $this->assertFailed(null, 401);
        $user = $this->userFactory()->create();
        $this->login($user);
        $this->assertSucceed([
            'name' => 'New Name',
        ]);
        $user = ApiUser::find($user->id);
        $this->assertTrue($user->name === 'New Name');
        $this->assertFailed([
            'name' => 'longlonglonglonglonglonglonglonglonglong' .
                'longlonglonglonglonglonglonglonglonglong' .
                'longlonglonglonglonglonglonglonglonglong' .
                'longlonglonglonglonglonglonglonglonglong' .
                'longlonglonglonglonglonglonglonglonglong' .
                'longlonglonglonglonglonglonglonglonglong' .
                'longlonglonglonglonglonglonglonglonglong',
        ], 422);
    }

    public function method()
    {
        return 'PUT';
    }

    public function uri()
    {
        return '/profile';
    }

    public function summary()
    {
        return 'Update the profile';
    }

    public function tag()
    {
        return 'profile';
    }

    public function rules()
    {
        return ProfileController::updateProfileRules();
    }
}
