<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Card extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'nickname', 'brand', 'last_four', 'expiration_month', 'expiration_year', 'stripe_id', 'zip_code'
    ];

    protected $hidden = [
        'stripe_id', 'api_user_id'
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
        return $user->default_card_id === $this->id;
    }

    public function setIsDefaultAttribute($value)
    {
        if ($value === true) {
            $user = Auth::guard('api')->user();
            $user->default_card_id = $this->id;
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
