<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RestaurantCategory extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'name',
    ];

    public function restaurants()
    {
        return $this->belongsToMany('App\Models\Restaurant', 'restaurant_restaurant_category');
    }
}
