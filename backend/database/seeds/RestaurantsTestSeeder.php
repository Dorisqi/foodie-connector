<?php

use Illuminate\Database\Seeder;

class RestaurantsTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call(RestaurantCategoriesTableSeeder::class);
        $restaurantsTableSeeder = $this->resolve(RestaurantsTableSeeder::class);
        $restaurantsTableSeeder->isTest = true;
        $restaurantsTableSeeder->__invoke();
    }
}
