<?php

use Faker\Generator as Faker;

$factory->define(\App\Models\Order::class, function (Faker $faker) {
    $currentTime = \Carbon\Carbon::parse('2018-10-27 15:00:01');
    return [
        'id' => 'ABC123',
        'create_at' => $currentTime->timestamp,
        'join_before' => $currentTime->copy()->addMinutes(10)->timestamp,
        'is_public' => true,
        'address_line_1' => '134 Pierce Street',
        'address_line_2' => 'Apt XXX',
        'city' => 'West Lafayette',
        'state' => 'IN',
        'zip_code' => '47906',
        'lat' => '40.4227584',
        'lng' => '-86.9090892',
        'phone' => '7650000000',
        'restaurant_id' => function () {
            return factory(\App\Models\Restaurant::class)->create()->id;
        },
        'creator_id' => function () {
            return \Illuminate\Support\Facades\Auth::guard('api')->user()->id;
        }
    ];
});
