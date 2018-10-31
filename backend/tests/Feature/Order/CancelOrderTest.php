<?php

namespace Tests\Feature\Order;

use App\Models\Order;
use Tests\ApiTestCase;

class CancelOrderTest extends ApiTestCase
{
    protected $id = 'A0000';

    /**
     * Test canceling orders
     *
     * @return void
     *
     * @throws \ReflectionException
     */
    public function testCancelOrder()
    {
        $this->assertFailed(null, 401);
        $this->login();
        $this->assertFailed(null, 404);
        $order = factory(Order::class)->create();
        $this->id = $order->id;
        $this->assertSucceed(null);
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

    protected function uriParams()
    {
        return [
            'id' => $this->id,
        ];
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
