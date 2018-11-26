<?php

namespace Tests\Feature\Order;

use App\Facades\Time;
use App\Http\Controllers\OrderController;
use App\Models\Order;
use Tests\ApiTestCase;
use Tests\UriWithId;

class JoinOrderTest extends ApiTestCase
{
    use UriWithId;

    /**
     * Test joining orders
     *
     * @return void
     */
    public function testJoinOrder()
    {
        $this->assertFailed(null, 401, false);
        $this->login();
        $order = factory(Order::class)->create();
        $this->id = $order->id;
        $this->login($this->userFactory()->state('new')->create());
        $this->assertSucceed([
            'phone' => '7653500000',
        ]);
        $this->assertFailed([
            'phone' => '7653500001',
        ], 422)->assertJson([
            'message' => 'You have already joined this order.',
        ]);
        $this->mockCurrentTime(Time::currentTime()->addHours(3)->toDateTimeString());
        $this->assertFailed([
            'phone' => '7653500002',
        ], 422)->assertJson([
            'message' => 'This order is no longer joinable.',
        ]);
        $response = $this->assertFailed(null, 422);
        $this->assertArrayHasKey('phone', $response->json('data'));
    }

    protected function method()
    {
        return 'POST';
    }

    protected function uri()
    {
        return '/orders/{id}/join';
    }

    protected function tag()
    {
        return 'order';
    }

    protected function summary()
    {
        return 'Join a group order';
    }

    protected function rules()
    {
        return OrderController::joinRules();
    }
}
