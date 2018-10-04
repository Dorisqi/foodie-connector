<?php

namespace Tests\Feature\Card;

use App\Models\ApiUser;
use App\Models\Card;
use Tests\ApiTestCase;

class DeleteCardTest extends ApiTestCase
{

    /**
     * Card id
     *
     * @var int
     */
    protected $id = 1;

    /**
     * Test deleting card
     *
     * @return void
     */
    public function testDeleteCard()
    {
        $this->assertFailed(null, 401);
        $user = $this->userFactory()->create();
        $this->login($user);
        $card = factory(Card::class)->create();
        $this->id = $card->id;
        $this->assertSucceed(null);
        $this->assertTrue(is_null(Card::find($card->id)));
        $this->assertTrue(is_null(ApiUser::find($user->id)->defaultAddress));
        $this->id = 0;
        $this->assertFailed(null, 404);
    }

    protected function method()
    {
        return 'DELETE';
    }

    protected function uri()
    {
        return '/cards/{id}';
    }

    protected function uriParams()
    {
        return [
            'id' => $this->id,
        ];
    }

    protected function summary()
    {
        return 'Delete an existed card';
    }

    protected function tag()
    {
        return 'card';
    }

    protected function rules()
    {
        return [];
    }
}
