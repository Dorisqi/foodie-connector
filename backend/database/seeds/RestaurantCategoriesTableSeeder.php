<?php

use Illuminate\Database\Seeder;

class RestaurantCategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $categories = json_decode(
            file_get_contents(base_path('database/seeds/data/restaurants/categories.json')),
            true
        );
        foreach ($categories as $category) {
            \App\Models\RestaurantCategory::firstOrCreate([
                'name' => $category,
            ]);
        }
    }
}
