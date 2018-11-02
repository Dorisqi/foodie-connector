<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    public $timestamps = false;

    public $incrementing = false;

    protected $primaryKey = 'api_user_id';

    protected $fillable = [
        'cart',
    ];

    protected $hidden = [
        'api_user_id',
    ];

    public function user()
    {
        return $this->belongsTo(ApiUser::class, 'api_user_id');
    }

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }

    protected $localSubtotal = null;

    /**
     * Calculate the summary of cart
     *
     * @param bool $saveAfterCalculation [optional]
     * @param array $cartData [optional]
     * @return void
     */
    public function calculateSummary(bool $saveAfterCalculation = false, array $cartData = null)
    {
        $cart = [];
        if (is_null($cartData)) {
            $cartData = json_decode($this->cart, true);
        }
        $restaurant = $this->restaurant()->with('restaurantMenu')->first();
        $menu = $restaurant->restaurantMenu->withoutCategories();
        $products = $menu['products'];
        $productOptionGroups = $menu['product_option_groups'];
        $updated = false;
        $subtotal = 0;
        foreach ($cartData as $cartItem) {
            $productAmount = $cartItem['product_amount'];
            if (!is_int($productAmount) || $productAmount < 0) {
                throw new \InvalidArgumentException();
            }
            if ($productAmount === 0) {
                $updated = true;
                continue;
            }
            $productId = $cartItem['product_id'];
            if (!isset($products[$productId])) {
                $updated = true;
                continue;
            }
            $singlePrice = $products[$productId]['price'];

            $optionGroups = [];
            foreach ($products[$productId]['product_option_groups'] as $optionGroupId) {
                $optionGroup = $productOptionGroups[$optionGroupId];
                if (!isset($optionGroup['options_map'])) {
                    $optionGroup['options_map'] = [];
                    foreach ($optionGroup['product_options'] as $option) {
                        $optionGroup['options_map'][$option['id']] = $option;
                    }
                }
                $optionGroups[$optionGroupId] = $optionGroup;
            }

            foreach ($cartItem['product_option_groups'] as $optionSelection) {
                $optionGroupId = $optionSelection['product_option_group_id'];
                if (!isset($optionGroups[$optionGroupId])) {
                    $updated = true;
                    continue 2;
                }
                $optionGroup = $optionGroups[$optionGroupId];
                $optionCount = 0;
                foreach ($optionSelection['product_options'] as $optionId) {
                    if (!isset($optionGroup['options_map'][$optionId])) {
                        $updated = true;
                        continue 3;
                    }
                    $optionCount++;
                    $singlePrice += $optionGroup['options_map'][$optionId]['price'];
                    unset($optionGroup['options_map'][$optionId]);
                }
                if ($optionCount < $optionGroup['min_choice']
                    || (!is_null($optionGroup['max_choice']) && $optionCount > $optionGroup['max_choice'])) {
                    $updated = true;
                    continue 2;
                }
                unset($optionGroups[$optionGroupId]);
            }

            $subtotal += $singlePrice * $productAmount;
            array_push($cart, $cartItem);
        }
        $this->cart = json_encode($cart);
        if ($updated || $saveAfterCalculation) {
            $this->save();
        }
        $this->localSubtotal = $subtotal;
    }

    public function getSubtotalAttribute()
    {
        if (is_null($this->localSubtotal)) {
            $this->calculateSummary();
        }
        return $this->localSubtotal;
    }

    public function toArray()
    {
        $data = parent::toArray();
        $data['subtotal'] = $this->subtotal;
        $data['cart'] = json_decode($this->cart, true);
        return $data;
    }
}
