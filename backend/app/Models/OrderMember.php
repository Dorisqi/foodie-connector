<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderMember extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'is_ready', 'phone',
    ];

    protected $hidden = [
        'id', 'order_id', 'api_user_id',
    ];

    public function user()
    {
        return $this->belongsTo(ApiUser::class, 'api_user_id');
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
