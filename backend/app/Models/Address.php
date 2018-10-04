<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Address extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'name', 'phone', 'line_1', 'line_2', 'city', 'state', 'zip_code', 'place_id', 'lat', 'lng',
    ];

    protected $hidden = [
        'api_user_id',
    ];

    public function user()
    {
        return $this->belongsTo('App\Models\ApiUser', 'api_user_id');
    }

    public function getIsDefaultAttribute()
    {
        if (is_null($this->api_user_id)) {
            return false;
        }
        return $this->user->default_address_id === $this->id;
    }

    public function setIsDefaultAttribute($value)
    {
        if (is_null($this->api_user_id)) {
            return;
        }
        if ($value === true) {
            $user = $this->user;
            $user->default_address_id = $this->id;
            $user->save();
        }
    }

    public function toArray()
    {
        $data = parent::toArray();
        if (!is_null($this->api_user_id)) {
            $data['is_default'] = $this->is_default;
        }
        return $data;
    }
}
