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
        $address = \App\Models\Address::create([
            'name' => 'ColdBox Pizza',
            'phone' => '765567765',
            'line_1' => '135 S Chauncey Ave',
            'city' => 'West Lafayette',
            'state' =>' IN',
            'zip_code' => '47906',
            'place_id' => 'ChIJ6SGX2a7iEogRPb45KHbDAUI',
            'latitude' => '40.423593',
            'longitude' => '-86.9080874',
        ]);
        \Illuminate\Support\Facades\DB::table('restaurants')->insert([
            'name' => 'ColdBox Pizza',
            'order_minimum' => '3.99',
            'delivery_fee' => '2.99',
            'address_id' => $address->id,
        ]);
    }
}
