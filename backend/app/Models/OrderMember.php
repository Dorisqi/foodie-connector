<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderMember extends Model
{
    use CompositePrimaryKeyTrait;

    public $timestamps = false;

    protected $primaryKey = ['order_id', 'api_user_id'];

    public $incrementing = false;

    protected $fillable = [
        'is_ready', 'phone', 'products', 'subtotal', 'tax', 'tip', 'delivery_fee', 'total',
    ];

    protected $hidden = [
        'order_id', 'api_user_id',
    ];

    public function user()
    {
        return $this->belongsTo(ApiUser::class, 'api_user_id');
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function toArray()
    {
        $data = parent::toArray();
        $data['products'] = is_null($this->products) ? null : json_decode($this->products);
        return $data;
    }
}
