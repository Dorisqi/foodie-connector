<?php

namespace Tests\Feature\Order;

use App\Http\Controllers\OrderController;
use App\Models\Address;
use App\Models\Cart;
use App\Models\Order;
use App\Models\Restaurant;
use Tests\ApiTestCase;

class DirectCheckoutTest extends ApiTestCase
{
    /**
     * Test direct checkout
     *
     * @return void
     */
    public function testDirectCheckout()
    {
        $this->assertFailed(null, 401, false);

        $this->login();

        $restaurant = factory(Restaurant::class)->create();
        $address = factory(Address::class)->create();
        $cart = factory(Cart::class)->create();
        $this->assertFailed([
            'restaurant_id' => $restaurant->id,
            'address_id' => $address->id,
        ], 422)->assertJson([
            'message' => 'The cart is empty.',
        ]);
        $this->assertSucceed([
            'restaurant_id' => $cart->restaurant_id,
            'address_id' => $address->id,
        ]);
    }

    protected function method()
    {
        return 'POST';
    }

    protected function uri()
    {
        return '/orders/direct-checkout';
    }

    protected function tag()
    {
        return 'order';
    }

    protected function summary()
    {
        return 'Direct checkout without a group order.';
    }

    protected function rules()
    {
        return OrderController::directCheckoutRules();
    }
}
