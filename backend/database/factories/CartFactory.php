<?php


$factory->define(\App\Models\Cart::class, function () {
    return [
        'api_user_id' => \Illuminate\Support\Facades\Auth::guard('api')->user()->id,
        'restaurant_id' => factory(\App\Models\Restaurant::class)->create()->id,
        'cart' => json_encode([
            [
                'product_id' => 0,
                'product_amount' => 2,
                'product_option_groups' => [
                    [
                        'product_option_group_id' => 0,
                        'product_options' => [0, 2],
                    ],
                ],
            ],
        ]),
    ];
});
