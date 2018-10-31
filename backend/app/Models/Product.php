<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'name', 'description', 'price', 'min_price', 'max_price', 'order'
    ];

    public function productCategory()
    {
        return $this->belongsTo(ProductCategory::class);
    }

    public function optionGroups()
    {
        return $this->belongsToMany(ProductOptionGroup::class, 'product_option_product_option_group');
    }
}
