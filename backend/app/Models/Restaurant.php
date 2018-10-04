<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Restaurant extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'name',
        'order_minimum',
        'delivery_fee',
        'rating',
        'phone',
        'address_line_1',
        'address_line_2',
        'city',
        'state',
        'zip_code',
        'place_id',
        'lat',
        'lng',
    ];

    protected $hidden = [
        'address_id',
    ];

    public function restaurantCategories()
    {
        return $this->belongsToMany('App\Models\RestaurantCategory', 'restaurant_restaurant_category');
    }

    public function toArray()
    {
        $data = parent::toArray();
        $categories = $this->restaurantCategories;
        unset($data['restaurant_categories']);
        $data['categories'] = [];
        foreach ($categories as $category) {
            array_push($data['categories'], $category->name);
        }
        return $data;
    }
}
