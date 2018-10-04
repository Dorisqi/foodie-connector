<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRestaurantRestaurantCategoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('restaurant_restaurant_category', function (Blueprint $table) {
            $table->unsignedInteger('restaurant_id');
            $table->unsignedInteger('restaurant_category_id');

            $table->primary('restaurant_id', 'restaurant_category_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('restaurant_restaurant_categorie');
    }
}
