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
        $restaurantsData = json_decode(
            file_get_contents(base_path('database/seeds/data/restaurants/restaurants.json')),
            true
        );
        foreach ($restaurantsData as $restaurantData) {
            $restaurant = \App\Models\Restaurant::firstOrNew([
                'yelp_id' => $restaurantData['yelp_id'],
            ]);
            $restaurant->fill(
                array_filter($restaurantData, function ($k) {
                    return $k !== 'categories';
                }, ARRAY_FILTER_USE_KEY)
            );
            $restaurant->image = 'restaurants/' . $restaurantData['yelp_id'] . '.jpg';
            $restaurant->save();
            $restaurant->restaurantCategories()->detach();
            foreach ($restaurantData['categories'] as $category) {
                $restaurant->restaurantCategories()->attach(
                    \App\Models\RestaurantCategory::where('name', $category)->first()->id
                );
            }
        }
    }
}
