<?php

namespace Tests\Feature\Restaurant;

use App\Models\Address;
use App\Models\Restaurant;
use Tests\ApiTestCase;
use Tests\UriWithId;

class ShowRestaurantTest extends ApiTestCase
{
    use UriWithId;

    /**
     * Test showing restaurant
     *
     * @return void
     */
    public function testShowRestaurant()
    {
        $this->assertFailed(null, 401);
        $this->login();
        $this->assertFailed(null, 404);
        $restaurant = factory(Restaurant::class)->create();
        $this->id = $restaurant->id;
        $response = $this->assertSucceed([
            'with_menu' => 'true',
        ]);
        $this->assertTrue(is_null($response->json('is_deliverable')));
        $this->assertTrue(is_null($response->json('distance')));
        $this->assertTrue(is_null($response->json('estimated_delivery_time')));
        $this->assertFailed([
            'address_id' => 0,
        ], 422);
        $address = factory(Address::class)->create();
        $response = $this->assertSucceed([
            'address_id' => $address->id,
        ]);
        $this->assertFalse(is_null($response->json('is_deliverable')));
        $this->assertFalse(is_null($response->json('distance')));
        $this->assertFalse(is_null($response->json('estimated_delivery_time')));
        $response = $this->assertSucceed([
            'place_id' => $address->place_id,
        ], false);
        $this->assertFalse(is_null($response->json('is_deliverable')));
        $this->assertFalse(is_null($response->json('distance')));
        $this->assertFalse(is_null($response->json('estimated_delivery_time')));
    }

    public function method()
    {
        return 'GET';
    }

    protected function uri()
    {
        return '/restaurants/{id}';
    }

    protected function summary()
    {
        return 'Get the detail of a specific restaurant';
    }

    protected function tag()
    {
        return 'restaurant';
    }

    protected function rules()
    {
        return [
            'with_menu' => 'boolean',
            'address_id' => 'integer',
            'place_id' => 'string',
        ];
    }
}
