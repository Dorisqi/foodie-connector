<?php

use Illuminate\Support\Facades\Auth;

$factory->define(\App\Models\Card::class, function () {
    return [
        'nickname' => 'Test Visa',
        'brand' => 'Visa',
        'last_four' => '4242',
        'expiration_month' => '12',
        'expiration_year' => '2030',
        'stripe_id' => function () {
            $customer = \Stripe\Customer::retrieve(Auth::guard('api')->user()->stripe_id);
            $card = $customer->sources->create([
                'source' => \App\Models\Card::testToken(),
            ]);
            return $card->id;
        },
        'zip_code' => '47906',
        'api_user_id' => function () {
            return Auth::guard('api')->user()->id;
        }
    ];
});
