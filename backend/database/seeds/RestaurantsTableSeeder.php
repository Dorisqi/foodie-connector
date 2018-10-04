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
            'name' => 'HotBox Pizza',
            'phone' => '765567765',
            'line_1' => '135 S Chauncey Ave',
            'city' => 'West Lafayette',
            'state' =>' IN',
            'zip_code' => '47906',
            'place_id' => 'ChIJ6SGX2a7iEogRPb45KHbDAUI',
            'lat' => '40.423593',
            'lng' => '-86.9080874',
        ]);
        \Illuminate\Support\Facades\DB::table('restaurants')->insert([
            'name' => 'HotBox Pizza',
            'order_minimum' => '10',
            'delivery_fee' => '2.99',
            'address_id' => $address->id,
        ]);
        $address = \App\Models\Address::create([
            'name' => 'Heisei Japanese Restaurant',
            'phone' => '765432234',
            'line_1' => '907 Sagamore Pkwy W',
            'city' => 'West Lafayette',
            'state' => 'IN',
            'zip_code' => '47906',
            'place_id' => 'ChIJKyr9T2r9EogRMUn4njQf-H8',
            'lat' => '40.4519488',
            'lng' => '-86.9195979',
        ]);
        \Illuminate\Support\Facades\DB::table('restaurants')->insert([
            'name' => 'Heisei Japanese Restaurant',
            'order_minimum' => '25',
            'delivery_fee' => '3.99',
            'address_id' => $address->id,
        ]);
    }
}
