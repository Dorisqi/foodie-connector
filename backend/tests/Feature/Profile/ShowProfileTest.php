<?php

namespace Tests\Feature\Profile;

use Tests\ApiTestCase;

class ShowProfileTest extends ApiTestCase
{
    /**
     * Test showing profile
     *
     * @return void
     */
    public function testShowProfile()
    {
        $this->assertFailed(null, 401, false);
        $user = $this->userFactory()->create();
        $this->login($user);
        $this->assertSucceed(null)->assertJson($user->toArray());
    }

    protected function method()
    {
        return 'GET';
    }

    protected function uri()
    {
        return '/profile';
    }

    protected function summary()
    {
        return 'Get the profile';
    }

    protected function tag()
    {
        return 'profile';
    }

    protected function rules()
    {
        return [];
    }
}
