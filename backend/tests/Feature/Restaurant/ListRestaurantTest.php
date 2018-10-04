<?php

namespace Tests\Feature\Restaurant;

use App\Models\Address;
use Illuminate\Support\Facades\Artisan;
use Tests\ApiTestCase;

class ListRestaurantTest extends ApiTestCase
{
    /**
     * Test listing restaurants
     *
     * @return void
     */
    public function testListRestaurant()
    {
        Artisan::call('db:seed', ['--class' => 'RestaurantsTableSeeder']);
        $this->assertFailed(null, 401);
        $this->login();
        $address = factory(Address::class)->create();
        $this->assertSucceed([
            'address_id' => $address->id,
        ])->assertJsonCount(2);
        $this->assertSucceed([
            'place_id' => $address->place_id,
        ])->assertJsonCount(2);
        $this->assertSucceed([
            'place_id' => 'ChIJA2p5p_9Qa4gRfOq5QPadjtY',
        ], false)->assertJsonCount(0);
        $this->assertFailed(null, 422);
    }

    protected function method()
    {
        return 'GET';
    }

    protected function uri()
    {
        return '/restaurants';
    }

    protected function summary()
    {
        return 'Get a list of all available restaurants';
    }

    protected function tag()
    {
        return 'restaurant';
    }

    protected function rules()
    {
        return [
            'address_id' => 'integer',
            'place_id' => 'string',
        ];
    }
}
