<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductOptionProductOptionGroupTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('product_option_product_option_group', function (Blueprint $table) {
            $table->unsignedInteger('product_id');
            $table->unsignedInteger('product_option_group_id');
            $table->unsignedInteger('order');

            $table->primary(['product_id', 'product_option_group_id'], 'id');
            $table->foreign('product_id')
                ->references('id')
                ->on('products')
                ->onDelete('cascade');
            $table->foreign('product_option_group_id', 'product_option_group_if_foreign')
                ->references('id')
                ->on('product_option_groups')
                ->onDelete('cascade');
            $table->index(['product_id', 'product_option_group_id', 'order'], 'order');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('product_option_product_option_group');
    }
}
