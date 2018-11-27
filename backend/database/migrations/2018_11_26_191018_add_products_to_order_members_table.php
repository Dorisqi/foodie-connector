<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddProductsToOrderMembersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('order_members', function (Blueprint $table) {
            $table->mediumText('products')->nullable();
            $table->decimal('subtotal')->nullable();
            $table->decimal('tax')->nullable();
            $table->decimal('tip')->nullable();
            $table->decimal('delivery_fee')->nullable();
            $table->decimal('total')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('order_members', function (Blueprint $table) {
            $table->dropColumn('products');
            $table->dropColumn('subtotal');
            $table->dropColumn('tax');
            $table->dropColumn('tip');
            $table->dropColumn('delivery_fee');
            $table->dropColumn('total');
        });
    }
}
