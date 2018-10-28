<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    public $timestamps = false;

    public $incrementing = false;

    protected $fillable = [
        'create_at',
        'join_before',
        'is_public',
        'address_line_1',
        'address_line_2',
        'city',
        'state',
        'zip_code',
        'lat',
        'lng',
        'phone',
    ];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function creator()
    {
        return $this->belongsTo(ApiUser::class);
    }

    public function getShareLinkAttribute()
    {
        return url('orders/' . $this->id);
    }

    public function toArray()
    {
        $data = parent::toArray();
        $data['share_link'] = $this->share_link;
        return $data;
    }
}
