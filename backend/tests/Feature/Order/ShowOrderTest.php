<?php

namespace Tests\Feature\Order;

use App\Facades\Time;
use App\Models\Order;
use Tests\ApiTestCase;
use Tests\UriWithId;

class ShowOrderTest extends ApiTestCase
{
    use UriWithId;

    /**
     * Test showing order
     *
     * @return void
     */
    public function testShowOrder()
    {
        $this->assertFailed(null, 401, false);
        $this->login();
        $this->id = 'A00000';
        $this->assertFailed(null, 404);
        $order = factory(Order::class)->create();
        $this->id = $order->id;
        $this->assertSucceed(null);
        $this->login($this->userFactory()->state('new')->create());
        $this->assertSucceed(null, false);
        $this->mockCurrentTime(Time::currentTime()->addHours(3)->toDateTimeString());
        $this->assertFailed(null, 404, false);
    }

    protected function method()
    {
        return 'GET';
    }

    protected function uri()
    {
        return '/orders/{id}';
    }

    protected function summary()
    {
        return 'Show the detail of a specific order';
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
