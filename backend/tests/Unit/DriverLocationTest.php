<?php

namespace Tests\Feature\Order;

use App\Events\DriverLocationUpdated;
use App\Facades\Time;
use App\Jobs\MockDriverLocation;
use App\Models\Order;
use App\Models\OrderStatus;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class DriverLocationTest extends TestCase
{
    /**
     * Test driver's location
     *
     * @return void
     */
    public function testDriverLocation()
    {
        Event::fake();

        $this->login();
        $order = factory(Order::class)->create();
        $order->orderStatuses()->create([
            'status' => OrderStatus::DELIVERING,
            'time' => Time::currentTime()->addMinutes(10),
        ]);

        $job = new MockDriverLocation();
        $job::$geoLocations = [[1, 1]];
        $job::$updatingInterval = 0;
        $job->handle();
        Event::assertDispatched(DriverLocationUpdated::class, function ($e) use ($order) {
            return $e->id === $order->id && $e->lat === 1 && $e->lng === 1;
        });

        $job::$geoLocations = [[2, 2], [3, 3]];
        $job->handle();
        Event::assertDispatched(DriverLocationUpdated::class, 3);
    }
}
