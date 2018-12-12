<?php

namespace Tests\Feature\Order;

use App\Facades\Time;
use App\Http\Controllers\OrderController;
use App\Models\Order;
use App\Models\OrderStatus;
use Tests\ApiTestCase;
use Tests\UriWithId;

class RateOrderTest extends ApiTestCase
{
    use UriWithId;

    /**
     * Test rating an order
     *
     * @return void
     */
    public function testRateOrder()
    {
        $this->assertFailed(null, 401, false);

        $this->login();
        $this->id = Order::TESTING_NOT_FOUND_ID;
        $this->assertFailed([
            'is_positive' => true,
        ], 404);

        $order = factory(Order::class)->create();
        $restaurant = $order->restaurant;
        $this->id = $order->id;

        $this->assertFailed([
            'is_positive' => false,
        ], 422)->assertJson([
            'message' => 'Only delivered orders can be rated.',
        ]);

        $order->orderStatuses()->create([
            'status' => OrderStatus::DELIVERED,
            'time' => Time::currentTime()->addMinutes(10),
        ]);
        $this->assertSucceed([
            'is_positive' => true,
        ]);
        $restaurant->refresh();
        $this->assertEquals(1, $restaurant->rate_count);
        $this->assertEquals(1, $restaurant->rate_positive_count);

        $this->assertSucceed([
            'is_positive' => false,
        ], false);
        $restaurant->refresh();
        $this->assertEquals(1, $restaurant->rate_count);
        $this->assertEquals(0, $restaurant->rate_positive_count);

        $restaurant->rate_count = 5;
        $restaurant->save();
        $this->assertSucceed([
            'is_positive' => true,
        ], false);
        $restaurant->refresh();
        $this->assertEquals(5, $restaurant->rate_count);
        $this->assertEquals(1, $restaurant->rate_positive_count);
        $this->assertEquals(1.0, $restaurant->rating);
    }

    protected function method()
    {
        return 'POST';
    }

    protected function uri()
    {
        return '/orders/{id}/rate';
    }

    protected function tag()
    {
        return 'order';
    }

    protected function summary()
    {
        return 'Rate the restaurant corresponding to the delivered order.';
    }

    protected function rules()
    {
        return OrderController::rateRules();
    }
}
