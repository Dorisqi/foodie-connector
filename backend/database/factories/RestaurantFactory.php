<?php

use Faker\Generator as Faker;

$factory->define(\App\Models\Restaurant::class, function (Faker $faker) {
    return [
        'name' => 'Test Restaurant',
        'image' => 'test.jpg',
        'order_minimum' => 9.99,
        'delivery_fee' => 2.99,
        'rating' => 3.5,
        'phone' => '7651111111',
        'address_line_1' => '100 Pierce Street',
        'city' => 'West Lafayette',
        'state' => 'IN',
        'zip_code' => '47906',
        'lat' => '40.4227584',
        'lng' => '-86.9090892',
    ];
});
