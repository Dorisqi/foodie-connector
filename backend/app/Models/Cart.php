<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    public $timestamps = false;

    public $incrementing = false;

    protected $primaryKey = 'api_user_id';

    protected $fillable = [
        'cart'
    ];

    protected $hidden = [
        'api_user_id', 'restaurant_id',
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
     * Doing filtering and calculating
     *
     * @param bool $saveAfterCalculation [optional]
     * @param array $cartData [optional]
     * @return array
     */
    public function calculate(bool $saveAfterCalculation = false, array $cartData = null)
    {
        if (is_null($this->api_user_id)) {
            $this->localSubtotal = 0;
            return [];
        }
        if (is_null($cartData)) {
            $cartData = json_decode($this->cart, true);
        }
        $restaurant = $this->restaurant()->with('restaurantMenu')->first();
        if (is_null($restaurant)) {
            $this->cart = '[]';
            $this->save();
            $this->localSubtotal = 0;
            return [];
        }
        $cart = [];
        $cartWithName = [];
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

            $optionGroupsWithName = [];
            foreach ($cartItem['product_option_groups'] as $optionSelection) {
                $options = [];

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
                    $option = $optionGroup['options_map'][$optionId];
                    array_push($options, $option['name']);
                    $optionCount++;
                    $singlePrice += $option['price'];
                    unset($optionGroup['options_map'][$optionId]);
                }
                if ($optionCount < $optionGroup['min_choice']
                    || (!is_null($optionGroup['max_choice']) && $optionCount > $optionGroup['max_choice'])) {
                    $updated = true;
                    continue 2;
                }

                array_push($optionGroupsWithName, [
                    'name' => $optionGroups[$optionGroupId]['name'],
                    'options' => $options,
                ]);

                unset($optionGroups[$optionGroupId]);
            }

            $cartItem['product_price'] = round($singlePrice, 2);
            $subtotal += $singlePrice * $productAmount;
            array_push($cart, $cartItem);
            array_push($cartWithName, [
                'name' => $products[$productId]['name'],
                'description' => $products[$productId]['description'],
                'price' => $singlePrice,
                'product_option_groups' => $optionGroupsWithName,
            ]);
        }
        $this->cart = json_encode($cart);
        if (empty($cart)) {
            $this->restaurant()->dissociate();
        }
        if ($updated || $saveAfterCalculation) {
            $this->save();
        }
        $this->localSubtotal = round($subtotal, 2);

        return $cartWithName;
    }

    public function getSubtotalAttribute()
    {
        if (is_null($this->localSubtotal)) {
            $this->calculate();
        }
        return $this->localSubtotal;
    }

    public function getTaxAttribute()
    {
        if (is_null($this->restaurant)) {
            return 0;
        }
        return round($this->localSubtotal * $this->restaurant->tax_percentage / 100, 2);
    }

    public function toArray()
    {
        $data = parent::toArray();
        $data['subtotal'] = $this->subtotal;
        $data['tax'] = $this->tax;
        $data['cart'] = json_decode($this->cart, true);
        $data['restaurant'] = $this->restaurant;
        return $data;
    }
}
