<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrderMembersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('order_members', function (Blueprint $table) {
            $table->increments('id');
            $table->string('order_id');
            $table->unsignedInteger('api_user_id');
            $table->boolean('is_ready')->default(false);
            $table->string('phone');

            $table->foreign('order_id')
                ->references('id')
                ->on('orders')
                ->onDelete(\Illuminate\Support\Facades\App::environment('testing') ? 'CASCADE' : 'RESTRICT');
            $table->foreign('api_user_id')
                ->references('id')
                ->on('api_users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('order_members');
    }
}
