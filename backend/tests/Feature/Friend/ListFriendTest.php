<?php

namespace Tests\Feature\Friend;

use Tests\ApiTestCase;

class ListFriendTest extends ApiTestCase
{
    /**
     * Test listing friends
     *
     * @return void
     */
    public function testListFriend()
    {
        $this->assertFailed(null, 401, false);

        $this->login();
        $friend = $this->userFactory()->states('new', 'friend')->create();

        $this->assertSucceed(null)->assertJson([[
            'name' => $friend->name,
            'friend_id' => $friend->friend_id,
        ]]);
    }

    protected function method()
    {
        return 'GET';
    }

    protected function uri()
    {
        return '/friends';
    }

    protected function rules()
    {
        return [];
    }

    protected function tag()
    {
        return 'friend';
    }

    protected function summary()
    {
        return 'List all friends';
    }
}
