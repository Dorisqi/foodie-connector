<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductOptionGroup extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'name', 'min_choice', 'max_choice',
    ];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function productOptions()
    {
        return $this->hasMany(ProductOption::class);
    }

    public function toArray()
    {
        $data = parent::toArray();
        $data['order'] = $data['pivot']['order'];
        unset($data['order']);
        return $data;
    }
}
