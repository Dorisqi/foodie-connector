<?php

namespace Tests\Feature\Order;

use App\Facades\Time;
use App\Http\Controllers\OrderController;
use App\Models\Address;
use App\Models\Order;
use App\Models\Restaurant;
use Illuminate\Support\Facades\DB;
use Tests\ApiTestCase;

class ListOrderTest extends ApiTestCase
{
    /**
     * Test listing orders
     *
     * @return void
     *
     * @throws \ReflectionException
     */
    public function testListOrder()
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

        $user = $this->userFactory()->state('new')->create();
        $this->login($user);
        $address = factory(Address::class)->create();
        $this->assertSucceed([
            'address_id' => $address->id,
        ])->assertJson([
            [
                'distance' => 0,
            ],
        ]);
        $this->assertSucceed([
            'place_id' => 'ChIJPbVda67iEogRTWzmvivderE',
        ])->assertJson([
            [
                'distance' => 279,
            ],
        ]);
        $this->assertSucceed([
            'place_id' => 'ChIJP5iLHkCuEmsRwMwyFmh9AQU',
        ], false)->assertJsonCount(0);

        $order->is_public = false;
        $order->save();
        $this->assertSucceed([
            'place_id' => 'ChIJPbVda67iEogRTWzmvivderE',
        ], false)->assertJsonCount(0);
        $order->is_public = true;
        $order->save();

        $this->mockCurrentTime(Time::currentTime()->addHours(3));
        $this->assertSucceed([
            'place_id' => 'ChIJPbVda67iEogRTWzmvivderE',
        ], false)->assertJsonCount(0);
        $response = $this->assertFailed([
            'address_id' => 0
        ], 422);
        $this->assertArrayHasKey('address_id', $response->json('data'));
        $response = $this->assertFailed([
            'place_id' => 'INVALID'
        ], 422);
        $this->assertArrayHasKey('place_id', $response->json('data'));
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
