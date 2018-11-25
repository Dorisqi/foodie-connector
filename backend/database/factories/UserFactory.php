<?php

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

$factory->define(ApiUser::class, function () {
    return [
        'name' => 'Test User',
        'email' => 'user@foodie-connector.delivery',
        'password' => Hash::make(ApiUser::testingPassword()),
        'stripe_id' => function () {
            $customer = \Stripe\Customer::create([
                'description' => 'ApiUser-Test',
            ]);
            return $customer->id;
        },
        'friend_id' => ApiUser::TESTING_FRIEND_ID,
    ];
});

$factory->state(ApiUser::class, 'new', [
    'email' => 'another-user@foodie-connector.delivery',
    'friend_id' => 'NEWFRD',
]);

$factory->state(ApiUser::class, 'exist', [
    'email' => 'exist@foodie-connector.delivery',
    'friend_id' => 'EXISTS',
]);

$factory->afterCreatingState(ApiUser::class, 'friend', function ($user) {
    \Illuminate\Support\Facades\Auth::guard('api')->user()->friends()->attach($user);
});
