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
        $response = $this->assertSucceed([
            'address_id' => $address->id,
            'filter_categories' => '1_2',
            'order_by_desc' => 'rating',
        ]);
        $this->assertCount(2, $response->json('restaurants'));
        $this->assertLessThan(
            $response->json('restaurants')[0]['rating'],
            $response->json('restaurants')[1]['rating']
        );
        $response = $this->assertSucceed([
            'place_id' => $address->place_id,
            'filter_distance' => '_1',
        ]);
        $this->assertCount(1, $response->json('restaurants'));
        $response = $this->assertSucceed([
            'place_id' => 'ChIJA2p5p_9Qa4gRfOq5QPadjtY',
        ], false);
        $this->assertCount(0, $response->json('restaurants'));
        $response = $this->assertSucceed([
            'address_id' => $address->id,
            'filter_order_minimum' => '15_',
            'filter_delivery_fee' => '_3',
        ], false);
        $this->assertCount(0, $response->json('restaurants'));
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
            'filter_categories' => 'string|pattern:id_id_...',
            'filter_distance' => 'string|pattern:[min]_[max]',
            'filter_estimated_delivery_time' => 'string|pattern:[min]_[max]',
            'filter_delivery_fee' => 'string|pattern:[min]_[max]',
            'filter_order_minimum' => 'string|pattern:[min]_[max]',
            'filter_rating' => 'string|pattern:[min]_[max]',
            'order_by' => 'string',
            'order_by_desc' => 'string',
        ];
    }
}
