<?php

use Illuminate\Database\Seeder;

class TaxAreasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \Illuminate\Support\Facades\DB::table('tax_areas')->insert([
            'name' => 'Indiana',
            'percentage' => 7,
        ]);
        \Illuminate\Support\Facades\DB::table('tax_areas')->insert([
            'name' => 'Downtown Chicago',
            'percentage' => 10.75,
        ]);
    }
}
