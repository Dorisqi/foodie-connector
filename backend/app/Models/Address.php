<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Address extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'name', 'phone', 'line_1', 'line_2', 'city', 'state', 'zip_code', 'place_id', 'latitude', 'longitude',
    ];

    protected $hidden = [
        'api_user_id',
    ];

    public function user()
    {
        return $this->belongsTo('App\Models\ApiUser', 'id', 'api_user_id');
    }

    public function getIsDefaultAttribute()
    {
        $user = Auth::guard('api')->user();
        if (is_null($user)) {
            return false;
        }
        return $user->default_address_id === $this->id;
    }

    public function setIsDefaultAttribute($value)
    {
        if ($value === true) {
            $user = Auth::guard('api')->user();
            $user->default_address_id = $this->id;
            $user->save();
        }
    }

    public function toArray()
    {
        $data = parent::toArray();
        $data['is_default'] = $this->is_default;
        return $data;
    }
}
