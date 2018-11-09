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

    public function restaurantCategories()
    {
        return $this->belongsToMany(RestaurantCategory::class, 'restaurant_restaurant_category');
    }

    public function operationTimes()
    {
        return $this->hasMany(OperationTime::class);
    }

    public function restaurantMenu()
    {
        return $this->hasOne(RestaurantMenu::class);
    }

    protected $localIsOpen = null;

    protected $localDistance = null;

    /**
     * Address for calculating the is_deliverable attribute
     *
     * @var object|array|null
     */
    protected $address = null;

    /**
     * Set address
     *
     * @param object|array $address
     * @return void
     */
    public function setAddress($address)
    {
        $this->address = $address;
        $this->localDistance = GeoLocation::distance($address, $this);
    }

    public function getIsOpenAttribute()
    {
        if (is_null($this->localIsOpen)) {
            $this->localIsOpen = $this->isOpenAt();
        }
        return $this->localIsOpen;
    }

    public function getDistanceAttribute()
    {
        return $this->localDistance;
    }

    public function getEstimatedDeliveryTimeAttribute()
    {
        if (is_null($this->localDistance)) {
            return null;
        }
        return (int)(20 + $this->localDistance * 3);
    }

    public function getIsDeliverableAttribute()
    {
        if (is_null($this->localDistance)) {
            return null;
        }
        return $this->localDistance <= 5;
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
        $data['image'] = Storage::disk(config('voyager.storage.disk'))->url('restaurants/' . $this->image);
        $data['is_open'] = $this->is_open;
        $data['distance'] = is_null($this->distance) ? null : round($this->distance, 1);
        $data['estimated_delivery_time'] = $this->estimated_delivery_time;
        $data['is_deliverable'] = $this->is_deliverable;

        return $data;
    }
}
