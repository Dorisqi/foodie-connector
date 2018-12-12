<?php

namespace Tests\Feature\Order;

use App\Console\Commands\MockDriverLocation;
use App\Events\DriverLocationUpdated;
use App\Facades\Time;
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
        MockDriverLocation::$updatingInterval = 0;
        MockDriverLocation::$stopAt = 1;
        $job->handle();
        Event::assertDispatched(DriverLocationUpdated::class, function ($e) use ($order) {
            return $e->id === $order->id
                && $e->lat === MockDriverLocation::$geoLocations[0][1]
                && $e->lng === MockDriverLocation::$geoLocations[0][0];
        });

        $job::$stopAt = 2;
        $job->handle();
        Event::assertDispatched(DriverLocationUpdated::class, 3);
    }
}
