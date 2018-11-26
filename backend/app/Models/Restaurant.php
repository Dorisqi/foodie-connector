<?php

namespace App\Models;

use App\Facades\GeoLocation;
use App\Facades\Time;
use Grimzy\LaravelMysqlSpatial\Eloquent\SpatialTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class Restaurant extends Model
{
    use SpatialTrait;

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
        'geo_location',
    ];

    protected $spatialFields = [
        'geo_location',
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

    /**
     * Return the query
     *
     * @param \Grimzy\LaravelMysqlSpatial\Types\Point|null $coordinates
     * @return Restaurant|\Illuminate\Database\Eloquent\Builder
     */
    public static function query($coordinates = null)
    {
        $query = Restaurant::with([
            'restaurantCategories',
            'operationTimes' => function ($query) {
                $query->orderBy('day_of_week')->orderBy('start_time');
            },
        ]);
        if (!is_null($coordinates)) {
            $lat = (float)$coordinates->getLat();
            $lng = (float)$coordinates->getLng();
            $query = $query->addSelect([
                '*',
                DB::raw("ROUND(ST_Distance_Sphere(geo_location, point(${lng}, ${lat})) / 1000, 1) AS distance"),
                DB::raw('ROUND(20 + (SELECT distance) * 3) AS estimated_delivery_time'),
                DB::raw('((SELECT distance) < 5) AS is_deliverable'),
                DB::raw(self::isOpenQuery('restaurants.id')),
            ]);
        }
        return $query;
    }

    /**
     * Return the query string for is_open
     *
     * @param int|string $restaurant_id
     * @param \Carbon\Carbon|null $time
     * @return string
     */
    public static function isOpenQuery($restaurant_id, $time = null)
    {
        $currentTime = is_null($time) ? Time::currentTime() : $time;
        $dayOfWeek = $currentTime->dayOfWeek;
        $nextDayOfWeek = ($dayOfWeek + 1) % 7;
        $currentTimeStr = $currentTime->toTimeString();
        return "EXISTS(SELECT * FROM operation_times WHERE restaurant_id=${restaurant_id} "
            . "AND ((day_of_week=${dayOfWeek} AND TIME('${currentTimeStr}') >= start_time "
            . "AND (TIME('${currentTimeStr}') < end_time OR start_time > end_time)) "
            . "OR (day_of_week=${nextDayOfWeek} AND start_time > end_time "
            . "AND TIME('${currentTimeStr}') < end_time))) as is_open";
    }

    protected $localIsOpen = null;

    public function toArray()
    {
        $data = parent::toArray();
        $data['image'] = Storage::disk(config('voyager.storage.disk'))->url('restaurants/' . $this->image);

        return $data;
    }
}
