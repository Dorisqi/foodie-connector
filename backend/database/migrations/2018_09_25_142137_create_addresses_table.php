<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAddressesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('phone');
            $table->string('line_1');
            $table->string('line_2')->nullable();
            $table->string('city');
            $table->string('state');
            $table->string('zip_code');
            $table->string('place_id');
            $table->decimal('lat', 10, 8);
            $table->decimal('lng', 11, 8);
            $table->unsignedInteger('api_user_id')->nullable();

            $table->foreign('api_user_id')
                ->references('id')->on('api_users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('addresses');
    }
}
