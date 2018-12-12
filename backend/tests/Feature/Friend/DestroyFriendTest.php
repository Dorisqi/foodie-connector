<?php

namespace Tests\Feature\Friend;

use Tests\ApiTestCase;
use Tests\UriWithId;

class DestroyFriendTest extends ApiTestCase
{
    use UriWithId;

    /**
     * Test destroying a friend
     *
     * @return void
     */
    public function testDestroyFriend()
    {
        $this->assertFailed(null, 401, false);

        $this->login();
        $friend = $this->userFactory()->states('new', 'friend')->create();
        $this->id = $friend->friend_id;
        $this->assertSucceed(null)->assertJson([]);
        $this->id = 'NOTEXI';
        $this->assertFailed(null, 404);
    }

    protected function method()
    {
        return 'DELETE';
    }

    protected function uri()
    {
        return '/friends/{id}';
    }

    protected function tag()
    {
        return 'friend';
    }

    protected function summary()
    {
        return 'Delete a friend';
    }

    protected function rules()
    {
        return [];
    }
}
