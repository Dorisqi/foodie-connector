<?php

namespace Tests\Feature\Card;

use App\Http\Controllers\CardController;
use App\Models\ApiUser;
use App\Models\Card;
use Tests\ApiTestCase;

class StoreCardTest extends ApiTestCase
{
    /**
     * Test storing card
     *
     * @return void
     */
    public function testStoreCard()
    {
        $this->assertFailed(null, 401, false);
        $user = $this->userFactory()->create();
        $this->login($user);
        $card = factory(Card::class)->make();
        $this->assertSucceed([
            'nickname' => $card->nickname,
            'token' => Card::testToken(),
            'is_default' => false,
        ], true);
        $user = ApiUser::find($user->id);
        $this->assertFalse(is_null($user->defaultCard));
        $this->assertFailed([
            'nickname' => $card->nickname,
            'token' => 'not_token',
            'is_default' => false,
        ], 422);
        $this->assertFailed([], 422);
    }

    protected function method()
    {
        return 'POST';
    }

    protected function uri()
    {
        return '/cards';
    }

    protected function summary()
    {
        return 'Add a new card';
    }

    protected function tag()
    {
        return 'card';
    }

    protected function rules()
    {
        return CardController::storeRules();
    }
}
