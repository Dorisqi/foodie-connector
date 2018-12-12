<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class MigrateToPointInRestaurantsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \App\Facades\Address::migrateToPoint('restaurants', \App\Models\Restaurant::class);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        \App\Facades\Address::migrateBackFromPoint('restaurants', \App\Models\Restaurant::class);
    }
}
