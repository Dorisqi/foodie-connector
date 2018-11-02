<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCartsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('carts', function (Blueprint $table) {
            $table->unsignedInteger('api_user_id');
            $table->unsignedInteger('restaurant_id')->nullable();
            $table->mediumText('cart');

            $table->primary('api_user_id');
            $table->foreign('api_user_id')
                ->references('id')
                ->on('api_users');
            $table->foreign('restaurant_id')
                ->references('id')
                ->on('restaurants');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('carts');
    }
}
