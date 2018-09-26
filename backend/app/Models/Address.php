<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'name', 'phone', 'line_1', 'line_2', 'city', 'state', 'zip_code', 'place_id'
    ];

    public function user()
    {
        return $this->belongsTo('App\Models\ApiUser', 'id', 'api_user_id');
    }
}
