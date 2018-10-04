<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Restaurant extends Model
{
    protected $fillable = [
        'name', 'order_minimum', 'delivery_fee',
    ];

    protected $hidden = [
        'address_id',
    ];

    public function address()
    {
        return $this->belongsTo('App\Models\Address');
    }

    public function toArray()
    {
        $data = parent::toArray();
        $data['address'] = $this->address->toArray();
        return $data;
    }
}
