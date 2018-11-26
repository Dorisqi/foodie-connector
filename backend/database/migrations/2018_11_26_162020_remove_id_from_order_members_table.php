<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RemoveIdFromOrderMembersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('order_members', function (Blueprint $table) {
            $table->dropColumn('id');
            $table->primary(['order_id', 'api_user_id'], 'id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     *
     * @throws \Exception
     */
    public function down()
    {
        throw new Exception('Not Supported');
    }
}
