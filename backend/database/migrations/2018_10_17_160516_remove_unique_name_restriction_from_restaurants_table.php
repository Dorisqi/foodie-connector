<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RemoveUniqueNameRestrictionFromRestaurantsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('restaurants', function (Blueprint $table) {
            $table->dropUnique(['name']);
            $table->string('yelp_id')->unique()->nullable();
        });

        Schema::table('restaurants', function (Blueprint $table) {
            $table->index('name');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('restaurants', function (Blueprint $table) {
            $table->dropIndex(['name']);
        });

        Schema::table('restaurants', function (Blueprint $table) {
            $table->unique('name');
            $table->dropColumn('yelp_id');
        });
    }
}
