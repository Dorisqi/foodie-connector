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
        \App\Models\RestaurantCategory::firstOrCreate([
            'name' => 'Pizza',
        ]);
        \App\Models\RestaurantCategory::firstOrCreate([
            'name' => 'Asian',
        ]);
        \App\Models\RestaurantCategory::firstOrCreate([
            'name' => 'Japanese',
        ]);
    }
}
