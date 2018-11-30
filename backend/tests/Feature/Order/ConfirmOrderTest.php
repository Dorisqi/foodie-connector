<?php

namespace Tests\Feature\Order;

use App\Events\OrderStatusUpdated;
use App\Models\Order;
use App\Models\OrderStatus;
use Illuminate\Support\Facades\Event;
use Tests\ApiTestCase;
use Tests\UriWithId;

class ConfirmOrderTest extends ApiTestCase
{
    use UriWithId;

    /**
     * Test confirming order
     *
     * @return void
     */
    public function testConfirmOrder()
    {
        Event::fake();

        $this->assertFailed(null, 401, false);

        $this->login();
        $this->id = Order::TESTING_NOT_FOUND_ID;
        $this->assertFailed(null, 404);

        $order = factory(Order::class)->create();
        $this->id = $order->id;
        $this->assertFailed(null, 422)->assertJson([
            'message' => 'Some or all of the order members are not ready.',
        ]);

        $orderMember = $order->orderMembers[0];
        $orderMember->is_ready = true;
        $orderMember->save();
        $this->assertFailed(null, 422)->assertJson([
            'message' => 'Failed to meet the order minimum.',
        ]);

        $order->restaurant->order_minimum = 0;
        $order->restaurant->save();
        $this->assertSucceed(null);
        Event::assertDispatched(OrderStatusUpdated::class, function ($e) use ($order) {
            return $e->data['order_id'] === $order->id
                && $e->data['status'] === OrderStatus::STATUS_NAMES[OrderStatus::CONFIRMED];
        });

        $this->assertFailed(null, 422)->assertJson([
            'message' => 'This order cannot be confirmed.',
        ]);
    }

    protected function method()
    {
        return 'POST';
    }

    protected function uri()
    {
        return '/orders/{id}/confirm';
    }

    protected function summary()
    {
        return 'Confirm an order.';
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
