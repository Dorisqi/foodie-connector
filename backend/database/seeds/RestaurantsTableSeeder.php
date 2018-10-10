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
        $restaurant = \App\Models\Restaurant::firstOrNew([
            'name' => 'ColdBox Pizza',
        ]);
        $restaurant->fill([
            'order_minimum' => '10',
            'delivery_fee' => '2.99',
            'rating' => '4.8',
            'phone' => '765567765',
            'address_line_1' => '135 S Chauncey Ave',
            'city' => 'West Lafayette',
            'state' =>' IN',
            'zip_code' => '47906',
            'place_id' => 'ChIJ6SGX2a7iEogRPb45KHbDAUI',
            'lat' => '40.423593',
            'lng' => '-86.9080874',
            'image' => 'mock/photo-1534308983496-4fabb1a015ee.jpg',
        ])->save();
        $restaurant->restaurantCategories()->detach();
        $restaurant->restaurantCategories()->attach(
            \App\Models\RestaurantCategory::where('name', 'Pizza')->first()->id
        );
        $restaurant = \App\Models\Restaurant::firstOrNew([
            'name' => 'Seihei Japanese Restaurant',
        ]);
        $restaurant->fill([
            'order_minimum' => '25',
            'delivery_fee' => '3.99',
            'rating' => '4.9',
            'phone' => '765432234',
            'address_line_1' => '907 Sagamore Pkwy W',
            'city' => 'West Lafayette',
            'state' => 'IN',
            'zip_code' => '47906',
            'place_id' => 'ChIJKyr9T2r9EogRMUn4njQf-H8',
            'lat' => '40.4519488',
            'lng' => '-86.9195979',
            'image' => 'mock/photo-1534422298391-e4f8c172dddb.jpg',
        ])->save();
        $restaurant->restaurantCategories()->detach();
        $restaurant->restaurantCategories()->attach(
            \App\Models\RestaurantCategory::where('name', 'Asian')->first()->id
        );
        $restaurant->restaurantCategories()->attach(
            \App\Models\RestaurantCategory::where('name', 'Japanese')->first()->id
        );
    }
}
