<?php

namespace Tests\Feature\Card;

use App\Models\Card;
use Tests\ApiTestCase;

class ListCardTest extends ApiTestCase
{
    /**
     * Test listing card
     *
     * @return void
     */
    public function testListCard()
    {
        $this->assertFailed(null, 401);
        $this->login();
        factory(Card::class, 3)->create();
        $this->login($this->userFactory()->create([
            'email' => 'another_user@foodie-connector.delivery',
        ]));
        factory(Card::class, 2)->create();
        $response = $this->assertSucceed(null);
        $response->assertJsonCount(2);
    }

    protected function method()
    {
        return 'GET';
    }

    protected function uri()
    {
        return '/cards';
    }

    protected function summary()
    {
        return 'Get the card list';
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
