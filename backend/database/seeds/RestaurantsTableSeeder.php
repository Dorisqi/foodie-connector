<?php

use Illuminate\Database\Seeder;

class RestaurantsTableSeeder extends Seeder
{
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
        foreach ($restaurantsData as $restaurantData) {
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

            $productOptionGroupIds = [];
            $productOptionGroups = [];
            $productOptionGroupIdCount = 0;
            $productOptionIdCount = 0;
            foreach ($restaurantData['optionGroups'] as $key => $optionGroup) {
                $productOptionGroup = [
                    'id' => $productOptionGroupIdCount++,
                    'name' => $optionGroup['name'],
                    'min_choice' => $optionGroup['min_choice'],
                    'max_choice' => $optionGroup['max_choice'],
                    'product_options' => [],
                ];
                $productOptionGroupIds[$key] = $productOptionGroup['id'];

                usort($optionGroup['options'], function ($a, $b) {
                    return $a['order'] <=> $b['order'];
                });
                foreach ($optionGroup['options'] as $option) {
                    $productOption = [
                        'id' => $productOptionIdCount++,
                        'name' => $option['name'],
                        'price' => $option['price'],
                    ];
                    array_push($productOptionGroup['product_options'], $productOption);
                }
                array_push($productOptionGroups, $productOptionGroup);
            }

            $productCategories = [];
            usort($restaurantData['product_categories'], function ($a, $b) {
                return $a['order'] <=> $b['order'];
            });
            $productCategoryIdCount = 0;
            $productIdCount = 0;
            foreach ($restaurantData['product_categories'] as $category) {
                $productCategory = [
                    'id' => $productCategoryIdCount++,
                    'name' => $category['name'],
                    'products' => [],
                ];

                usort($category['items'], function ($a, $b) {
                    return $a['order'] <=> $b['order'];
                });
                foreach ($category['items'] as $item) {
                    $product = array_merge([
                        'id' => $productIdCount++,
                    ], array_only($item, [
                        'name', 'description', 'price', 'min_price', 'max_price',
                    ]));

                    $product['product_option_groups'] = [];
                    usort($item['optionGroups'], function ($a, $b) {
                        return $a['order'] <=> $b['order'];
                    });
                    foreach ($item['optionGroups'] as $optionGroup) {
                        array_push(
                            $product['product_option_groups'],
                            $productOptionGroupIds[$optionGroup['grubhub_id']]
                        );
                    }

                    array_push($productCategory['products'], $product);
                }

                array_push($productCategories, $productCategory);
            }

            $restaurant->restaurantMenu()->create([
                'menu' => json_encode([
                    'product_categories' => $productCategories,
                    'product_option_groups' => $productOptionGroups,
                ]),
            ]);

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
        }
    }
}
