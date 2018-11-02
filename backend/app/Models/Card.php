<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Stripe\Token;

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
        return $this->belongsTo('App\Models\ApiUser', 'api_user_id');
    }

    public function getIsDefaultAttribute()
    {
        return $this->user->default_card_id === $this->id;
    }

    public function setIsDefaultAttribute($value)
    {
        if ($value === true) {
            $user = $this->user;
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

    public static function testToken()
    {
        $token = Token::create([
            'card[number]' => 4242424242424242,
            'card[exp_month]' => 12,
            'card[exp_year]' => 2030,
            'card[cvc]' => 111,
            'card[address_zip]' => 47906,
        ]);
        return $token->id;
    }
}
