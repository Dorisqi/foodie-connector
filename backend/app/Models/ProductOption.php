<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductOption extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'name', 'price', 'order',
    ];

    public function productOptionGroup()
    {
        return $this->belongsTo(ProductOptionGroup::class);
    }
}
