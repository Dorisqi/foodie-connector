<?php

namespace Tests\Feature\Order;

use App\Facades\Time;
use App\Http\Controllers\OrderController;
use App\Models\Address;
use App\Models\OperationTime;
use App\Models\Restaurant;
use Carbon\Carbon;
use Tests\ApiTestCase;

class CreateOrderTest extends ApiTestCase
{
    /**
     * Test creating orders
     *
     * @return void
     *
     * @throws \ReflectionException
     */
    public function testCreateOrder()
    {
        $this->seedRestaurantData();
        $this->assertFailed(null, 401);
        $this->login();
        $address = factory(Address::class)->create();
        $restaurant = Restaurant::first();
        $restaurant->fill([
            'lat' => $address->lat,
            'lng' => $address->lng,
        ])->save();
        $restaurant->operationTimes()->delete();
        $restaurant->operationTimes()->create([
            'day_of_week' => 6,
            'start_time' => '12:00:00',
            'end_time' => '2:00:00',
        ]);
        $property = new \ReflectionProperty(Time::class, 'currentTimeStamp');
        $property->setAccessible(true);
        $property->setValue(Carbon::parse('2018-10-27 15:00:01')->timestamp);
        $this->assertSucceed([
            'restaurant_id' => $restaurant->id,
            'join_limit' => 600,
            'address_id' => $address->id,
            'is_public' => true,
        ]);
        $property->setValue(Carbon::parse('2018-10-27 11:50:00')->timestamp);
        $this->assertSucceed([
            'restaurant_id' => $restaurant->id,
            'join_limit' => 7200,
            'address_id' => $address->id,
            'is_public' => false,
        ], false);
        $property->setValue(Carbon::parse('2018-10-28 12:00:00')->timestamp);
        $response = $this->assertFailed([
            'restaurant_id' => $restaurant->id,
            'join_limit' => 7200,
            'address_id' => $address->id,
            'is_public' => false,
        ], 422)->content();
        $this->assertArrayHasKey('join_limit', json_decode($response, true)['data']);
        $response = $this->assertFailed([
            'restaurant_id' => $restaurant->id,
            'join_limit' => 600,
            'address_id' => 0,
            'is_public' => false,
        ], 422, false)->content();
        $this->assertArrayHasKey('address_id', json_decode($response, true)['data']);
        $address->fill([
            'lat' => 0,
            'lng' => 0,
        ])->save();
        $restaurant->fill([
            'lat' => 10,
            'lng' => 10,
        ])->save();
        $response = $this->assertFailed([
            'restaurant_id' => $restaurant->id,
            'join_limit' => 600,
            'address_id' => $address->id,
            'is_public' => false,
        ], 422)->content();
        $this->assertArrayHasKey('address_id', json_decode($response, true)['data']);
    }

    public function method()
    {
        return 'POST';
    }

    public function uri()
    {
        return '/orders';
    }

    public function summary()
    {
        return 'Create a new order';
    }

    public function tag()
    {
        return 'order';
    }

    protected function rules()
    {
        return OrderController::rules();
    }
}
