<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DropDeliveryZonesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('delivery_zones');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::create('delivery_zones', function (Blueprint $table) {
            $table->increments('id');
            $table->string('polygon'); // TODO: Use polygon (MySQL)
            $table->decimal('delivery_fee');
            $table->unsignedInteger('restaurant_id');

            $table->foreign('restaurant_id')->references('id')->on('restaurants');
        });
    }
}
