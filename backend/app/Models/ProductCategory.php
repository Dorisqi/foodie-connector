<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductCategory extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'name', 'order',
    ];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
