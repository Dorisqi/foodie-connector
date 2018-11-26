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
     * @throws \ReflectionException
     */
    public function testOrderQuery()
    {
        $this->login();
        $order = factory(Order::class)->create();
        $this->assertArraySubset([
            'order_status' => 'created',
            'is_creator' => 1,
            'is_member' => 1,
            'is_joinable' => 1,
            'is_visible' => 1,
        ], Order::query(false)->find($order->id)->toArray());
        $this->login($this->userFactory()->state('new')->create());
        $this->assertArraySubset([
            'order_status' => 'created',
            'is_creator' => 0,
            'is_member' => 0,
            'is_joinable' => 1,
            'is_visible' => 1,
        ], Order::query(false)->find($order->id)->toArray());
        $orderStatus = new OrderStatus([
            'status' => OrderStatus::CLOSED,
            'time' => Time::currentTime()->addMinutes(1),
        ]);
        $order->orderStatuses()->save($orderStatus);
        $this->assertArraySubset([
            'order_status' => 'closed',
            'is_creator' => 0,
            'is_member' => 0,
            'is_joinable' => 0,
            'is_visible' => 0,
        ], Order::query(false)->find($order->id)->toArray());
        $orderStatus->delete();
        $this->mockCurrentTime(Time::currentTime()->addHours(3)->toDateTimeString());
        $this->assertArraySubset([
            'order_status' => 'created',
            'is_creator' => 0,
            'is_member' => 0,
            'is_joinable' => 0,
            'is_visible' => 0,
        ], Order::query(false)->find($order->id)->toArray());
    }
}
