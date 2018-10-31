<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RecreateRestaurantsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['restaurant_id']);
        });
        Schema::dropIfExists('restaurants');
        Schema::create('restaurants', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('image');
            $table->decimal('order_minimum');
            $table->decimal('delivery_fee');
            $table->decimal('rating', 2, 1)->nullable();

            \App\Facades\Address::migrate($table);
        });
        Schema::table('orders', function (Blueprint $table) {
            $table->foreign('restaurant_id')->references('id')->on('restaurants');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['restaurant_id']);
        });
        Schema::dropIfExists('restaurants');
        Schema::create('restaurants', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->decimal('order_minimum');
            $table->decimal('delivery_fee');
            $table->decimal('rating', 2, 1);

            $table->string('phone');
            $table->string('address_line_1');
            $table->string('address_line_2')->nullable();
            $table->string('city');
            $table->string('state');
            $table->string('zip_code');
            $table->decimal('lat', 10, 8);
            $table->decimal('lng', 11, 8);

            $table->string('image')->nullable();

            $table->string('yelp_id')->unique()->nullable();

            $table->index('name');
            $table->index('order_minimum');
            $table->index('delivery_fee');
            $table->index('rating');
        });
        Schema::table('orders', function (Blueprint $table) {
            $table->foreign('restaurant_id')->references('id')->on('restaurants');
        });
    }
}
