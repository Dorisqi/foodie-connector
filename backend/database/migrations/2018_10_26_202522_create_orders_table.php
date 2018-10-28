<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->string('id')->unique();
            $table->unsignedInteger('restaurant_id');
            $table->unsignedInteger('creator_id');
            $table->timestamp('create_at');
            $table->timestamp('join_before');
            $table->timestamp('close_at')->nullable();
            $table->boolean('is_public');
            \App\Facades\Address::migrate($table);

            $table->foreign('restaurant_id')->references('id')->on('restaurants');
            $table->foreign('creator_id')->references('id')->on('api_users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
}
