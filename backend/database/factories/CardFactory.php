<?php

$factory->define(\App\Models\Card::class, function () {
    return [
        'nickname' => 'Test Visa',
        'brand' => 'Visa',
        'last_four' => '4242',
        'expiration_month' => '12',
        'expiration_year' => '2030',
        'stripe_id' => 'card_1DGzEgAv8osFAEU4zEmZ3peR',
        'zip_code' => '47906',
    ];
});
