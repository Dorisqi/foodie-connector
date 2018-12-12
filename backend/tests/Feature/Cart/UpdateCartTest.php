<?php

namespace Tests\Feature\Cart;

use App\Http\Controllers\CartController;
use App\Models\Restaurant;
use Tests\ApiTestCase;

class UpdateCartTest extends ApiTestCase
{
    /**
     * Test updating cart
     *
     * @return void
     */
    public function testUpdateCart()
    {
        $this->assertFailed(null, 401, false);
        $this->login();
        $this->assertFailed([
            'restaurant_id' => 0,
        ], 422);
        $restaurant = factory(Restaurant::class)->create();
        $response = $this->assertSucceed([
            'restaurant_id' => $restaurant->id,
            'cart' => [
                [
                    'product_id' => 0,
                    'product_amount' => 2,
                    'product_option_groups' => [
                        [
                            'product_option_group_id' => 0,
                            'product_options' => [0, 2],
                        ],
                    ],
                ],
            ],
        ])->assertJson([
            'subtotal' => 9.98,
            'tax' => 0.70
        ]);
        $this->assertSucceed([
            'restaurant_id' => $restaurant->id,
            'cart' => [
                [
                    'product_id' => 0,
                    'product_amount' => 1,
                    'product_option_groups' => [
                        [
                            'product_option_group_id' => 0,
                            'product_options' => [],
                        ],
                    ],
                ],
            ],
        ], false)->assertJson([
            'subtotal' => 0,
            'tax' => 0,
        ]);
        $this->assertFailed([
            'restaurant_id' => $restaurant->id,
            'cart' => [
                [
                    'product_id' => 0,
                    'product_amount' => -1,
                    'product_option_groups' => [
                        [
                            'product_option_group_id' => 0,
                            'product_options' => [],
                        ],
                    ],
                ],
            ],
        ], 422);
        $this->assertSucceed([
            'restaurant_id' => null,
            'cart' => [],
        ])->assertJson([
            'restaurant' => null,
            'cart' => [],
            'subtotal' => 0,
            'tax' => 0,
        ]);
        $this->assertSucceed([
            'restaurant_id' => $restaurant->id,
            'cart' => [],
        ], false)->assertJson([
            'restaurant' => null,
            'cart' => [],
            'subtotal' => 0,
            'tax' => 0,
        ]);
    }

    protected function method()
    {
        return 'PUT';
    }

    protected function uri()
    {
        return '/cart';
    }

    protected function summary()
    {
        return 'Update the cart';
    }

    protected function tag()
    {
        return 'cart';
    }

    protected function rules()
    {
        return CartController::rules();
    }
}
