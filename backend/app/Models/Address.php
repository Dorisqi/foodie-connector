<?php

namespace App\Models;

use Grimzy\LaravelMysqlSpatial\Eloquent\SpatialTrait;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use SpatialTrait;

    public $timestamps = false;

    protected $fillable = [
        'name', 'phone', 'line_1', 'line_2', 'city', 'state', 'zip_code', 'place_id', 'geo_location',
    ];

    protected $hidden = [
        'api_user_id',
    ];

    protected $spatialFields = [
        'geo_location',
    ];

    public function user()
    {
        return $this->belongsTo('App\Models\ApiUser', 'api_user_id');
    }

    public function getIsDefaultAttribute()
    {
        return (int)$this->user->default_address_id === (int)$this->id;
    }

    public function setIsDefaultAttribute($value)
    {
        if ($value === true) {
            $user = $this->user;
            $user->default_address_id = $this->id;
            $user->save();
        }
    }

    public function toArray()
    {
        $data = parent::toArray();
        $data['is_default'] = $this->is_default;
        unset($data['user']);
        return $data;
    }
}
