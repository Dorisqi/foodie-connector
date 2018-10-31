<?php

namespace Tests\Feature\Restaurant;

use App\Models\Address;
use App\Models\Restaurant;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
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
        $this->assertFailed(null, 401);
        $this->login();
        $address = factory(Address::class)->create();
        for ($i = 0; $i < 3; $i++) {
            factory(Restaurant::class)->create([
                'delivery_fee' => $i + 1,
            ]);
        }
        $response = $this->assertSucceed([
            'address_id' => $address->id,
            'filter_delivery_fee' => '2_3',
            'order_by_desc' => 'rating',
        ]);
        $this->setDocumentResponse([
            'restaurants' => $this->limitArrayLength($response->json('restaurants'), 1),
        ]);
        $restaurants = $response->json('restaurants');
        for ($i = 0; $i < count($restaurants); $i++) {
            $this->assertLessThanOrEqual(3, $restaurants[$i]['delivery_fee']);
            $this->assertGreaterThanOrEqual(2, $restaurants[$i]['delivery_fee']);
            if ($i > 0) {
                $this->assertLessThanOrEqual($restaurants[$i - 1]['rating'], $restaurants[$i]['rating']);
            }
        }
        $response = $this->assertSucceed([
            'place_id' => $address->place_id,
            'filter_distance' => '_1',
        ]);
        $this->setDocumentResponse([
            'restaurants' => $this->limitArrayLength($response->json('restaurants'), 1),
        ]);
        Log::debug($response->json('restaurants')[0]);
        $restaurants = $response->json('restaurants');
        for ($i = 0; $i < count($restaurants); $i++) {
            $this->assertLessThanOrEqual(1, $restaurants[$i]['distance']);
        }
        $response = $this->assertSucceed([
            'place_id' => 'ChIJP5iLHkCuEmsRwMwyFmh9AQU',
        ], false);
        $this->assertCount(0, $response->json('restaurants'));
        $response = $this->assertSucceed([
            'address_id' => $address->id,
            'filter_categories' => '0',
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
            'filter_is_open' => 'boolean',
            'order_by' => 'string',
            'order_by_desc' => 'string',
        ];
    }
}
