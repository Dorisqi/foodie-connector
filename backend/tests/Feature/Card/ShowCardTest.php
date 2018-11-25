<?php

namespace Tests\Feature\Card;

use App\Models\Card;
use Tests\ApiTestCase;
use Tests\UriWithId;

class ShowCardTest extends ApiTestCase
{
    use UriWithId;

    /**
     * Test showing card
     *
     * @return void
     */
    public function testShowCard()
    {
        $this->assertFailed(null, 401, false);
        $this->login();
        $card = factory(Card::class)->create();
        $this->id = $card->id;
        $cardArray = $card->toArray();
        $cardArray['is_default'] = false;
        $this->assertSucceed(null)->assertJson($cardArray);
        $this->id = 0;
        $this->assertFailed(null, 404);
    }

    protected function method()
    {
        return 'GET';
    }

    protected function uri()
    {
        return '/cards/{id}';
    }

    protected function summary()
    {
        return 'Show detail of a specific card';
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
