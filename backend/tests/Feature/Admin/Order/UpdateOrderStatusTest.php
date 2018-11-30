<?php

namespace Tests\Feature\Admin\Order;

use App\Events\OrderStatusUpdated;
use App\Models\Admin\User;
use App\Models\Order;
use App\Models\OrderStatus;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Event;
use Tests\ApiTestCase;
use Tests\UriWithId;

class UpdateOrderStatusTest extends ApiTestCase
{
    use UriWithId;

    protected $documented = false;

    protected const PREFIX = '/admin';

    /**
     * Test updating order status
     *
     * @return void
     */
    public function testUpdateOrderStatus()
    {
        Event::fake();

        $this->login();
        $this->id = Order::TESTING_NOT_FOUND_ID;
        $this->assertFailed([
            'status' => OrderStatus::CONFIRMED,
        ], 404);

        $order = factory(Order::class)->create();
        $this->id = $order->id;
        $this->assertFailed(null, 404);

        $user = factory(User::class)->create();
        Auth::guard()->login($user);
        $this->assertFailed([
            'status' => OrderStatus::CONFIRMED,
        ], 302);
        Event::assertDispatched(OrderStatusUpdated::class);

        $order = Order::query(false, null, null, false)->find($order->id);
        $this->assertEquals(OrderStatus::CONFIRMED, $order->order_status);
    }

    protected function method()
    {
        return 'POST';
    }

    protected function uri()
    {
        return '/orders/{id}/edit';
    }
}
