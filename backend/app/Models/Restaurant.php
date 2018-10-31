<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Restaurant extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'name',
        'image',
        'order_minimum',
        'delivery_fee',
        'rating',
        'phone',
        'address_line_1',
        'address_line_2',
        'city',
        'state',
        'zip_code',
        'lat',
        'lng',
    ];

    public function restaurantCategories()
    {
        return $this->belongsToMany(RestaurantCategory::class, 'restaurant_restaurant_category');
    }

    public function operationTimes()
    {
        return $this->hasMany(OperationTime::class);
    }

    public function productCategories()
    {
        return $this->hasMany(ProductCategory::class);
    }

    public function productOptionGroups()
    {
        return $this->hasMany(ProductOptionGroup::class);
    }

    public function toArray()
    {
        $data = parent::toArray();
        $data['image'] = Storage::disk(config('voyager.storage.disk'))->url($this->image);
        $categories = $this->restaurantCategories;
        unset($data['restaurant_categories']);
        $data['categories'] = [];
        foreach ($categories as $category) {
            array_push($data['categories'], $category->name);
        }
        return $data;
    }
}
