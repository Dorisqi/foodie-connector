<?php

$factory->define(\App\Models\Restaurant::class, function () {
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

$factory->afterCreating(\App\Models\Restaurant::class, function ($restaurant) {
    $restaurant->operationTimes()->create([
        'day_of_week' => 6,
        'start_time' => '12:00:00',
        'end_time' => '2:00:00',
    ]);

    $productCategory = [
        'id' => 0,
        'name' => 'Test Category',
        'products' => [],
    ];

    $product = [
        'id' => 0,
        'name' => 'Test Product',
        'description' => 'This is a test product',
        'price' => 2.99,
        'min_price' => 3.99,
        'max_price' => 4.99,
        'product_option_groups' => [0],
    ];
    array_push($productCategory['products'], $product);

    $productOptionGroup = [
        'id' => 0,
        'name' => 'Test Option Group',
        'min_choice' => 1,
        'max_choice' => 2,
        'product_options' => [],
    ];

    foreach ([1, 2, 3] as $i) {
        $productOption = [
            'id' => $i - 1,
            'name' => "Test Option $i",
            'price' => 1.00,
        ];
        array_push($productOptionGroup['product_options'], $productOption);
    }

    $restaurantMenu = new \App\Models\RestaurantMenu([
        'menu' => json_encode([
            'product_categories' => [$productCategory],
            'product_option_groups' => [$productOptionGroup],
        ]),
    ]);
    $restaurantMenu->restaurant()->associate($restaurant);
    $restaurantMenu->save();

    foreach ([1, 2] as $i) {
        $category = \App\Models\RestaurantCategory::firstOrCreate([
            'name' => "Category $i",
        ]);
        $restaurant->restaurantCategories()->attach($category);
    }
});
