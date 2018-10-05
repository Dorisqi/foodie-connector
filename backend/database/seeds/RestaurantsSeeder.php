<?php

use Illuminate\Database\Seeder;

class RestaurantsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call(RestaurantCategoriesTableSeeder::class);
        $this->call(RestaurantsTableSeeder::class);
    }
}
