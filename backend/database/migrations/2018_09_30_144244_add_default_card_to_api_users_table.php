<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\App;

class AddDefaultCardToApiUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('api_users', function (Blueprint $table) {
            $table->unsignedInteger('default_card_id')->nullable();

            if (!App::environment('testing')) {
                $table->foreign('default_card_id')->references('id')->on('cards');
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('api_users', function (Blueprint $table) {
            $table->dropForeign(['default_card_id']);
        });

        Schema::table('api_users', function (Blueprint $table) {
            $table->dropColumn('default_card_id');
        });
    }
}
