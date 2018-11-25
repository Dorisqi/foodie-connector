<?php

namespace Tests\Feature\Order;

use App\Http\Controllers\OrderController;
use App\Models\Order;
use App\Models\Restaurant;
use Tests\ApiTestCase;

class ListOrderTest extends ApiTestCase
{
    /**
     * Test listing orders
     *
     * @return void
     */
    public function testListingOrder()
    {
        $this->assertFailed(null, 401, false);
        $this->login();
        $order = factory(Order::class)->create();
        $this->assertSucceed(null)->assertJsonCount(1);
        $this->assertSucceed([
            'restaurant_id' => $order->restaurant_id,
            'order_status' => 'created',
        ])->assertJsonCount(1);
        $restaurant = factory(Restaurant::class)->create();
        $this->assertSucceed([
            'restaurant_id' => $restaurant->id,
        ], false)->assertJsonCount(0);
    }

    protected function method()
    {
        return 'GET';
    }

    protected function uri()
    {
        return '/orders';
    }

    protected function summary()
    {
        return 'Get a list of orders';
    }

    protected function tag()
    {
        return 'order';
    }

    protected function rules()
    {
        return OrderController::listRules();
    }
}
