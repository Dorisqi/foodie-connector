<?php

namespace App\Models;

use App\Facades\Time;
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

    protected $localIsOpen = null;

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

    public function getIsOpenAttribute()
    {
        if (is_null($this->localIsOpen)) {
            $this->localIsOpen = false;
            foreach ($this->operationTimes as $operationTime) {
                if ($operationTime->contains()) {
                    $this->localIsOpen = true;
                    break;
                }
            }
        }
        return $this->localIsOpen;
    }

    public function toArray()
    {
        $data = parent::toArray();
        $data['image'] = Storage::disk(config('voyager.storage.disk'))->url($this->image);
        $categories = $this->restaurantCategories;
        unset($data['restaurant_categories']);
        $data['categories'] = [];
        $data['is_open'] = $this->is_open;
        foreach ($categories as $category) {
            array_push($data['categories'], $category->name);
        }
        return $data;
    }
}
