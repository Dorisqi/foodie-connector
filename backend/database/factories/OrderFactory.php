<?php

$factory->define(\App\Models\Order::class, function () {
    $currentTime = \Carbon\Carbon::parse('2018-10-27 15:00:01');
    return [
        'id' => \App\Models\Order::TESTING_ID,
        'join_before' => $currentTime->copy()->addMinutes(10),
        'is_public' => true,
        'address_line_1' => '134 Pierce Street',
        'address_line_2' => 'Apt XXX',
        'city' => 'West Lafayette',
        'state' => 'IN',
        'zip_code' => '47906',
        'geo_location' => new \Grimzy\LaravelMysqlSpatial\Types\Point(40.4227584, -86.9090892),
        'phone' => '7650000000',
        'restaurant_id' => function () {
            return factory(\App\Models\Restaurant::class)->create()->id;
        },
        'creator_id' => function () {
            return \Illuminate\Support\Facades\Auth::guard('api')->user()->id;
        }
    ];
});

$factory->afterCreating(
    \App\Models\Order::class,
    function (\App\Models\Order $order) {
        $orderMember = new \App\Models\OrderMember([
            'phone' => $order->phone,
        ]);
        $orderMember->user()->associate(\Illuminate\Support\Facades\Auth::guard('api')->user());
        $orderMember->order()->associate($order);
        $orderMember->save();

        $orderStatus = new \App\Models\OrderStatus([
            'status' => \App\Models\OrderStatus::CREATED,
            'time' => \App\Facades\Time::currentTime(),
        ]);
        $orderStatus->order()->associate($order);
        $orderStatus->save();
    }
);
