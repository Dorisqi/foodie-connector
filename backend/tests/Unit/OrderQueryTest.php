<?php

namespace Tests\Unit;

use App\Facades\Time;
use App\Models\Order;
use App\Models\OrderStatus;
use Tests\TestCase;

class OrderQueryTest extends TestCase
{
    /**
     * Test order query
     *
     * @return void
     *
     * @throws \Exception
     */
    public function testOrderQuery()
    {
        $this->login();
        $order = factory(Order::class)->create();
        $this->assertArraySubset([
            'order_status' => 'created',
            'is_creator' => true,
            'is_member' => true,
            'is_joinable' => true,
            'is_visible' => true,
        ], Order::query(false)->find($order->id)->toArray());
        $this->login($this->userFactory()->state('new')->create());
        $this->assertArraySubset([
            'order_status' => 'created',
            'is_creator' => false,
            'is_member' => false,
            'is_joinable' => true,
            'is_visible' => true,
        ], Order::query(false)->find($order->id)->toArray());

        $currentTime = Time::currentTime();
        $this->mockCurrentTime($currentTime->copy()->addHours(3));
        $this->assertNull(Order::query(false)->find($order->id));
        $this->mockCurrentTime($currentTime);

        $orderStatus = new OrderStatus([
            'status' => OrderStatus::CLOSED,
            'time' => Time::currentTime()->addMinutes(1),
        ]);
        $order->orderStatuses()->save($orderStatus);
        $this->assertNull(Order::query(false)->find($order->id));
        $orderStatus->delete();
        $this->mockCurrentTime(Time::currentTime()->addHours(3)->toDateTimeString());
        $this->assertNull(Order::query(false)->find($order->id));
    }
}
