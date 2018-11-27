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

        $user = $this->userFactory()->create();
        $this->login($user);
        $friend = $this->userFactory()->state('new')->create();
        $this->assertSucceed([
            'friend_id' => $friend->friend_id,
        ]);
        $user->friends()->detach($friend);
        $this->assertSucceed([
            'email' => $friend->email,
        ]);
        $this->assertFailed([
            'email' => 'invalid@foodie-conenctor.delivery',
        ], 422);
        $this->assertFailed([
            'friend_id' => 'INVALD'
        ], 422, false);
        $friend = $this->userFactory()->states('exist', 'friend')->create();
        $this->assertFailed([
            'friend_id' => $friend->friend_id,
        ], 422, false)->assertJson([
            'message' => 'This user is already your friend.',
        ]);
        $this->assertFailed([
            'email' => $friend->email,
        ], 422)->assertJson([
            'message' => 'This user is already your friend.',
        ]);
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
