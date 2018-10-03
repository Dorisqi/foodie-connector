<?php

use Faker\Generator as Faker;
use Illuminate\Support\Facades\Hash;
use App\Models\ApiUser;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory should contain each of the model factory definitions for
| your application. Factories provide a convenient way to generate new
| model instances for testing / seeding your application's database.
|
*/

$factory->define(ApiUser::class, function (Faker $faker) {
    return [
        'name' => 'Test User',
        'email' => 'user@foodie-connector.delivery',
        'password' => Hash::make(ApiUser::testingPassword()),
        'stripe_id' => function () {
            $customer = \Stripe\Customer::create([
                'description' => 'ApiUser-Test',
            ]);
            return $customer->id;
        }
    ];
});
