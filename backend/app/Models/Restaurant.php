<?php

namespace App\Models;

use App\Facades\GeoLocation;
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
            $this->localIsOpen = $this->isOpenAt();
        }
        return $this->localIsOpen;
    }

    /**
     * Return if the given address is deliverable
     *
     * @param array $address
     * @return bool
     */
    public function deliverable(array $address)
    {
        return GeoLocation::distance([
            'lat' => $this->lat,
            'lng' => $this->lng,
        ], $address) <= 5;
    }

    /**
     * Return if the restaurant is open at the given time
     *
     * @param \Carbon\Carbon|null $time [optional]
     * @return bool
     */
    public function isOpenAt($time = null)
    {
        if (is_null($time)) {
            $time = Time::currentTime();
        }
        $result = false;
        foreach ($this->operationTimes as $operationTime) {
            if ($operationTime->contains($time)) {
                $result = true;
                break;
            }
        }
        return $result;
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
