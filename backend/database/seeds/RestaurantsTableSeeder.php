<?php

use Illuminate\Database\Seeder;

class RestaurantsTableSeeder extends Seeder
{
    public $isTest = false;

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $dataPath = base_path('database/seeds/data/restaurants');
        $restaurantsData = json_decode(
            file_get_contents("${dataPath}/restaurants.json"),
            true
        );
        $categories = \App\Models\RestaurantCategory::all();
        $categoryIds = [];
        foreach ($categories as $category) {
            $categoryIds[$category['name']] = $category['id'];
        }
        $restaurantCount = 0;
        foreach ($restaurantsData as $restaurantData) {
            if ($this->isTest && $restaurantCount >= 5) {
                break;
            }
            $restaurantCount++;
            $this->command->info('Seeding restaurant ' . $restaurantData['name']);
            $restaurant = new \App\Models\Restaurant(
                array_only($restaurantData, array_merge([
                    'name', 'image', 'order_minimum', 'delivery_fee', 'rating',
                ], \App\Facades\Address::addressFields()))
            );
            if ($restaurant['order_minimum'] == 0) {
                $restaurant['order_minimum'] = 9.99;
            }
            if ($restaurant['delivery_fee'] == 0) {
                $restaurant['delivery_fee'] = 2.99;
            }
            if ($restaurant['rating'] == 0) {
                $restaurant['rating'] = null;
            }
            $restaurant->save();

            foreach ($restaurantData['categories'] as $category) {
                $restaurant->restaurantCategories()->attach($categoryIds[$category]);
            }

            foreach ($restaurantData['available_hours'] as $available_hour) {
                $operationTime = new \App\Models\OperationTime([
                    'day_of_week' => $available_hour['day_of_week'] % 7,
                    'start_time' => $available_hour['start_time'],
                    'end_time' => $available_hour['end_time'],
                ]);
                $operationTime->restaurant()->associate($restaurant);
                $operationTime->save();
            }

            $grubhubId = $restaurantData['grubhub_id'];
            $menuData = json_decode(
                file_get_contents("${dataPath}/menu-${grubhubId}.json"),
                true
            );

            $productOptionGroupIds = [];
            foreach ($menuData['optionGroups'] as $key => $optionGroup) {
                $productOptionGroup = new \App\Models\ProductOptionGroup([
                    'name' => $optionGroup['name'],
                    'min_choice' => $optionGroup['min_choice'],
                    'max_choice' => $optionGroup['max_choice'],
                ]);
                $productOptionGroup->restaurant()->associate($restaurant);
                $productOptionGroup->save();
                $productOptionGroupIds[$key] = $productOptionGroup->id;
                foreach ($optionGroup['options'] as $option) {
                    $productOption = new \App\Models\ProductOption([
                        'name' => $option['name'],
                        'price' => $option['price'],
                        'order' => $option['order'],
                    ]);
                    $productOption->productOptionGroup()->associate($productOptionGroup);
                    $productOption->save();
                }
            }

            $productCount = 0;
            foreach ($menuData['categories'] as $category) {
                $productCategory = new \App\Models\ProductCategory([
                    'name' => $category['name'],
                    'order' => $category['order'],
                ]);
                $productCategory->restaurant()->associate($restaurant);
                $productCategory->save();
                foreach ($category['items'] as $item) {
                    if ($this->isTest && $productCount >= 5) {
                        break 2;
                    }
                    $productCount++;
                    $product = new \App\Models\Product([
                        'name' => $item['name'],
                        'description' => $item['description'],
                        'price' => $item['price'],
                        'min_price' => $item['minimum_price'],
                        'max_price' => $item['maximum_price'],
                        'order' => $item['order'],
                    ]);
                    $product->productCategory()->associate($productCategory);
                    $product->save();
                    foreach ($item['optionGroups'] as $optionGroup) {
                        $product->optionGroups()->attach(
                            $productOptionGroupIds[$optionGroup['grubhub_id']],
                            [
                                'order' => $optionGroup['order'],
                            ]
                        );
                    }
                }
            }
        }
    }
}
