<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Card extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'nickname', 'brand', 'last_four', 'expiration_month', 'expiration_year', 'stripe_id'
    ];

    protected $hidden = [
        'stripe_id', 'api_user_id'
    ];
}
