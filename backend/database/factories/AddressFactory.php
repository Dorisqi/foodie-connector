<?php

use Illuminate\Support\Facades\Auth;

$factory->define(\App\Models\Address::class, function () {
    return [
        'name' => 'Test User',
        'phone' => '7653500000',
        'line_1' => '134 Pierce St',
        'line_2' => 'Apt XXX',
        'city' => 'West Lafayette',
        'state' => 'IN',
        'zip_code' => '47906',
        'place_id' => 'ChIJO_0IEK_iEogR4GrIyYopzz8',
        'api_user_id' => function () {
            return Auth::guard('api')->user()->id;
        },
        'geo_location' => new \Grimzy\LaravelMysqlSpatial\Types\Point(40.4227584, -86.9090892),
    ];
});
