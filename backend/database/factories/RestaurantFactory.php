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

    $productCategory = new \App\Models\ProductCategory([
        'name' => 'Test Category',
        'order' => 1,
    ]);
    $productCategory->restaurant()->associate($restaurant);
    $productCategory->save();

    $product = new \App\Models\Product([
        'name' => 'Test Product',
        'description' => 'This is a test product',
        'price' => 2.99,
        'min_price' => 3.99,
        'max_price' => 4.99,
        'order' => 1,
    ]);
    $product->productCategory()->associate($productCategory);
    $product->save();

    $productOptionGroup = new \App\Models\ProductOptionGroup([
        'name' => 'Test Option Group',
        'min_choice' => 1,
        'max_choice' => 2,
    ]);
    $productOptionGroup->restaurant()->associate($restaurant);
    $productOptionGroup->save();
    $product->productOptionGroups()->attach($productOptionGroup, [
        'order' => 1,
    ]);

    foreach ([1, 2, 3] as $i) {
        $productOption = new \App\Models\ProductOption([
            'name' => "Test Option $i",
            'price' => 1.00,
            'order' => $i,
        ]);
        $productOption->productOptionGroup()->associate($productOptionGroup);
        $productOption->save();
    }

    foreach ([1, 2] as $i) {
        $category = \App\Models\RestaurantCategory::firstOrCreate([
            'name' => "Category $i",
        ]);
        $restaurant->restaurantCategories()->attach($category);
    }
});
