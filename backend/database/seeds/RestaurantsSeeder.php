<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RestaurantsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('restaurant_categories')->delete();
        DB::table('restaurants')->delete();
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('restaurant_categories')->truncate();
        DB::table('restaurants')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        $this->call(RestaurantCategoriesTableSeeder::class);
        $this->call(RestaurantsTableSeeder::class);
    }
}
