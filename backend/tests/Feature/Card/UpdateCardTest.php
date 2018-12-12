<?php

namespace Tests\Feature\Card;

use App\Http\Controllers\CardController;
use App\Models\Card;
use Tests\ApiTestCase;
use Tests\UriWithId;

class UpdateCardTest extends ApiTestCase
{
    use UriWithId;

    /**
     * Test updating card
     *
     * @return void
     */
    public function testUpdateCard()
    {
        $this->assertFailed(null, 401, false);
        $this->login();
        $card = factory(Card::class)->create();
        $this->id = $card->id;
        $cardArray = $card->toArray();
        $cardArray['zip_code'] = '47907';
        $cardArray['is_default'] = true;
        $response = $this->assertSucceed([
            'zip_code' => '47907',
            'is_default' => true,
        ]);
        $response->assertJson([$cardArray]);
        $this->assertFailed([
            'expiration_month' => 1,
            'expiration_year' => 2018,
        ], 422);
        $this->id = 0;
        $this->assertFailed(null, 404);
    }

    protected function method()
    {
        return 'PUT';
    }

    protected function uri()
    {
        return '/cards/{id}';
    }

    protected function summary()
    {
        return 'Update an existed card';
    }

    protected function tag()
    {
        return 'card';
    }

    protected function rules()
    {
        return CardController::updateRules();
    }
}
