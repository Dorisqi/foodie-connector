<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFriendIdToApiUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('api_users', function (Blueprint $table) {
            $table->string('friend_id')->nullable()->unique();
        });

        $users = \App\Models\ApiUser::all();
        foreach ($users as $user) {
            $friendId = null;
            while (true) {
                $friendId = strtoupper(bin2hex(openssl_random_pseudo_bytes(3)));
                if (\App\Models\ApiUser::where('friend_id', $friendId)->doesntExist()) {
                    break;
                }
            }
            $user->friend_id = $friendId;
            $user->save();
        }

        Schema::table('api_users', function (Blueprint $table) {
            $table->string('friend_id')->nullable(false)->change();
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
            $table->dropColumn('friend_id');
        });
    }
}
