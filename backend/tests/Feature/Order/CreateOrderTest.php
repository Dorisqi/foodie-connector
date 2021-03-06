<?php

namespace Tests\Feature\Order;

use App\Http\Controllers\OrderController;
use App\Models\Address;
use App\Models\Order;
use App\Models\Restaurant;
use Grimzy\LaravelMysqlSpatial\Types\Point;
use Tests\ApiTestCase;

class CreateOrderTest extends ApiTestCase
{
    /**
     * Test creating orders
     *
     * @return void
     */
    public function testCreateOrder()
    {
        $this->assertFailed(null, 401, false);
        $this->login();
        $address = factory(Address::class)->create();
        $restaurant = factory(Restaurant::class)->create();
        $this->assertSucceed([
            'restaurant_id' => $restaurant->id,
            'join_limit' => 600,
            'address_id' => $address->id,
            'is_public' => true,
        ]);
        $this->setDocumentResponse([
            'id' => Order::TESTING_ID,
            'share_link' => 'http://localhost/orders/' . Order::TESTING_ID,
            'qr_code_link' => 'http://localhost/orders/qr-code/' . Order::TESTING_ID,
        ]);
        Order::first()->delete();
        $this->mockCurrentTime('2018-10-27 11:50:00');
        $this->assertSucceed([
            'restaurant_id' => $restaurant->id,
            'join_limit' => 7200,
            'address_id' => $address->id,
            'is_public' => false,
        ], false);
        $response = $this->assertFailed([
            'restaurant_id' => $restaurant->id,
            'join_limit' => 7200,
            'address_id' => $address->id,
            'is_public' => false,
        ], 422);
        $this->assertArrayHasKey('form', $response->json('data'));
        Order::first()->delete();
        $this->mockCurrentTime('2018-10-28 12:00:00');
        $response = $this->assertFailed([
            'restaurant_id' => $restaurant->id,
            'join_limit' => 7200,
            'address_id' => $address->id,
            'is_public' => false,
        ], 422);
        $this->assertArrayHasKey('join_limit', $response->json('data'));
        $response = $this->assertFailed([
            'restaurant_id' => $restaurant->id,
            'join_limit' => 600,
            'address_id' => 0,
            'is_public' => false,
        ], 422, false);
        $this->assertArrayHasKey('address_id', $response->json('data'));
        $address->fill([
            'geo_location' => new Point(0, 0),
        ])->save();
        $restaurant->fill([
            'geo_location' => new Point(10, 10),
        ])->save();
        $response = $this->assertFailed([
            'restaurant_id' => $restaurant->id,
            'join_limit' => 600,
            'address_id' => $address->id,
            'is_public' => false,
        ], 422);
        $this->assertArrayHasKey('address_id', $response->json('data'));
    }

    public function method()
    {
        return 'POST';
    }

    public function uri()
    {
        return '/orders';
    }

    public function summary()
    {
        return 'Create a new order';
    }

    public function tag()
    {
        return 'order';
    }

    protected function rules()
    {
        return OrderController::rules();
    }
}
