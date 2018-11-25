<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFriendsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('friends', function (Blueprint $table) {
            $table->unsignedInteger('api_user_id');
            $table->string('friend_id');

            $table->primary(['api_user_id', 'friend_id'], 'id');
            $table->foreign('api_user_id')
                ->references('id')
                ->on('api_users');
            $table->foreign('friend_id')
                ->references('friend_id')
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
        Schema::dropIfExists('friends');
    }
}
