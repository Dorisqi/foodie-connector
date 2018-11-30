<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class FixTimestampDefaultsInTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \Illuminate\Support\Facades\DB::statement('ALTER TABLE `orders` CHANGE `join_before` `join_before` '
            . 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;');
        \Illuminate\Support\Facades\DB::statement('ALTER TABLE `order_statuses` CHANGE `time` `time` '
            . 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        \Illuminate\Support\Facades\DB::statement('ALTER TABLE `orders` CHANGE `join_before` `join_before` '
            . 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP  ON UPDATE CURRENT_TIMESTAMP;');
        \Illuminate\Support\Facades\DB::statement('ALTER TABLE `order_statuses` CHANGE `time` `time` '
            . 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP  ON UPDATE CURRENT_TIMESTAMP;');
    }
}
