<?php

namespace Tests\Feature\Friend;

use App\Http\Controllers\FriendController;
use Tests\ApiTestCase;

class StoreFriendTest extends ApiTestCase
{
    /**
     * Test storing friend
     *
     * @return void
     */
    public function testStoreFriend()
    {
        $this->assertFailed(null, 401, false);

        $this->login();
        $friend = $this->userFactory()->state('new')->create();
        $this->assertSucceed([
            'friend_id' => $friend->friend_id,
        ]);
        $this->assertFailed([
            'friend_id' => 'INVALD'
        ], 422);
        $friend = $this->userFactory()->states('exist', 'friend')->create();
        $this->assertFailed([
            'friend_id' => $friend->friend_id,
        ], 422);
    }

    protected function method()
    {
        return 'POST';
    }

    protected function uri()
    {
        return '/friends';
    }

    protected function tag()
    {
        return 'friend';
    }

    protected function summary()
    {
        return 'Add a new friend';
    }

    protected function rules()
    {
        return FriendController::storeRules();
    }
}
