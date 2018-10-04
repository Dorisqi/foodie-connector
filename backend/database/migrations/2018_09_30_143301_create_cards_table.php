<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCardsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cards', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nickname');
            $table->string('brand');
            $table->string('last_four', 4);
            $table->integer('expiration_month');
            $table->integer('expiration_year');
            $table->string('zip_code')->nullable();
            $table->string('stripe_id');
            $table->unsignedInteger('api_user_id');

            $table->foreign('api_user_id')->references('id')->on('api_users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cards');
    }
}
