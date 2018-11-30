<?php

use Faker\Generator as Faker;

$factory->define(\App\Models\Admin\User::class, function (Faker $faker) {
    return [
        'name' => 'Admin',
        'email' => 'admin@foodie-connector.delivery',
        'password' => \Illuminate\Support\Facades\Hash::make('admin'),
    ];
});
