<?php

namespace Tests\Feature\Cart;

use App\Models\Cart;
use App\Models\Restaurant;
use Tests\ApiTestCase;

class ShowCartTest extends ApiTestCase
{
    /**
     * Test showing cart
     *
     * @return void
     */
    public function testShowCart()
    {
        $this->assertFailed(null, 401);
        $this->login();
        $response = $this->assertSucceed(null);
        $response->assertJson([
            'restaurant' => null,
            'cart' => [],
            'subtotal' => 0,
        ]);
        $cart = factory(Cart::class)->create();
        $response = $this->assertSucceed(null);
        $response->assertJson([
            'restaurant' => [
                'id' => $cart->restaurant_id,
            ],
            'cart' => json_decode($cart->cart, true),
            'subtotal' => (2.99 + 2 * 1) * 2,
        ]);
    }

    protected function method()
    {
        return 'GET';
    }

    protected function uri()
    {
        return '/cart';
    }

    protected function summary()
    {
        return 'Get the current cart';
    }

    protected function tag()
    {
        return 'cart';
    }

    protected function rules()
    {
        return [];
    }
}
