<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\App;

class AddDefaultForeignOnDeleteToApiUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!App::environment('testing')) {
            Schema::table('api_users', function (Blueprint $table) {
                $table->dropForeign(['default_address_id']);
                $table->dropForeign(['default_card_id']);
            });
        }

        Schema::table('api_users', function (Blueprint $table) {
            $table->foreign('default_address_id')
                ->references('id')
                ->on('addresses')
                ->onDelete('set null');
            $table->foreign('default_card_id')
                ->references('id')
                ->on('cards')
                ->onDelete('set null');
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
            $table->dropForeign(['default_address_id']);
            $table->dropForeign(['default_card_id']);
        });

        Schema::table('api_users', function (Blueprint $table) {
            $table->foreign('default_address_id')
                ->references('id')
                ->on('addresses');
            $table->foreign('default_card_id')
                ->references('id')
                ->on('cards');
        });
    }
}
