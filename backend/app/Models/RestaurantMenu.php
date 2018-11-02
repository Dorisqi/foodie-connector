<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RestaurantMenu extends Model
{
    public $timestamps = false;

    public $incrementing = false;

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
        $menuData = json_decode($this->menu, true);
        $productCategories = $menuData['product_categories'];
        $productOptionGroups = $menuData['product_option_groups'];
        foreach ($productCategories as &$productCategory) {
            foreach ($productCategory['products'] as &$product) {
                $subOptionGroups = [];
                foreach ($product['product_option_groups'] as $productOptionGroup) {
                    array_push($subOptionGroups, $productOptionGroups[$productOptionGroup]);
                }
                $product['product_option_groups'] = $subOptionGroups;
            }
        }
        return $productCategories;
    }
}
