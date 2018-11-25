<?php

namespace Tests\Feature\Order;

use App\Http\Controllers\OrderController;
use App\Models\Address;
use App\Models\Order;
use App\Models\Restaurant;
use Tests\ApiTestCase;

class CreateOrderTest extends ApiTestCase
{
    /**
     * Test creating orders
     *
     * @return void
     *
     * @throws \ReflectionException
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
        Order::query()->delete();
        $this->mockCurrentTime('2018-10-27 11:50:00');
        $this->assertSucceed([
            'restaurant_id' => $restaurant->id,
            'join_limit' => 7200,
            'address_id' => $address->id,
            'is_public' => false,
        ], false);
        Order::query()->delete();
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
            'lat' => 0,
            'lng' => 0,
        ])->save();
        $restaurant->fill([
            'lat' => 10,
            'lng' => 10,
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
