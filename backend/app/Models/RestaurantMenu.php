<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RestaurantMenu extends Model
{
    public $timestamps = false;

    public $incrementing = false;

    protected $primaryKey = 'restaurant_id';

    protected $guarded = [];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }

    /**
     * Return a menu without product categories
     *
     * @return array
     */
    public function withoutCategories()
    {
        $menuData = json_decode($this->menu, true);
        $products = [];
        foreach ($menuData['product_categories'] as $productCategory) {
            $products = array_merge($products, $productCategory['products']);
        }
        usort($products, function ($a, $b) {
            return $a['id'] <=> $b['id'];
        });
        return [
            'products' => $products,
            'product_option_groups' => $menuData['product_option_groups'],
        ];
    }

    public function toArray()
    {
        return json_decode($this->menu, true);
    }
}
