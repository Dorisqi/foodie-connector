<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Restaurant extends Model
{
    public $timestamps = false;

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

    public function restaurantCategories()
    {
        return $this->belongsToMany('App\Models\RestaurantCategory', 'restaurant_restaurant_category');
    }

    public function toArray()
    {
        $data = parent::toArray();
        $data['address'] = $this->address->toArray();
        $categories = $this->restaurantCategories;
        $data['categories'] = [];
        foreach ($categories as $category) {
            array_push($data['categories'], $category->name);
        }
        return $data;
    }
}
