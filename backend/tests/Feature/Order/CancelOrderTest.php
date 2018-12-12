<?php

namespace Tests\Feature\Order;

use App\Events\OrderStatusUpdated;
use App\Models\Order;
use App\Models\OrderStatus;
use Illuminate\Support\Facades\Event;
use Tests\ApiTestCase;
use Tests\UriWithId;

class CancelOrderTest extends ApiTestCase
{
    use UriWithId;

    /**
     * Test canceling orders
     *
     * @return void
     */
    public function testCancelOrder()
    {
        Event::fake();

        $this->assertFailed(null, 401, false);

        $this->login();
        $this->id = Order::TESTING_NOT_FOUND_ID;
        $this->assertFailed(null, 404);

        $order = factory(Order::class)->create();
        $this->id = $order->id;
        $this->assertSucceed(null);
        Event::assertDispatched(OrderStatusUpdated::class, function ($e) use ($order) {
            return $e->data['order_id'] === $order->id
                && $e->data['status'] === OrderStatus::STATUS_NAMES[OrderStatus::CLOSED];
        });

        $this->assertFailed(null, 422);
    }

    protected function method()
    {
        return 'DELETE';
    }

    protected function uri()
    {
        return '/orders/{id}';
    }

    protected function summary()
    {
        return 'Cancel and order';
    }

    protected function tag()
    {
        return 'order';
    }

    protected function rules()
    {
        return [];
    }
}
