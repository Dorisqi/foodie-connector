<?php

namespace Tests\Feature\Order;

use App\Models\Order;
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
        $this->assertFailed(null, 401);
        $this->login();
        $this->id = 'A00000';
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
