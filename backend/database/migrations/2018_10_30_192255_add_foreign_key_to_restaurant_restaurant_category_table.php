<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddForeignKeyToRestaurantRestaurantCategoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('restaurant_restaurant_category', function (Blueprint $table) {
            $table->foreign('restaurant_id')
                ->references('id')
                ->on('restaurants')
                ->onDelete('cascade');
            $table->foreign('restaurant_category_id')
                ->references('id')
                ->on('restaurant_categories')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('restaurant_restaurant_category', function (Blueprint $table) {
            $table->dropForeign(['restaurant_id']);
            $table->dropForeign(['restaurant_category_id']);
        });
    }
}
