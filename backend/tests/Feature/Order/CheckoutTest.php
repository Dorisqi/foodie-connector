<?php

namespace Tests\Feature\Order;

use App\Facades\Time;
use App\Http\Controllers\OrderController;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderStatus;
use Tests\ApiTestCase;
use Tests\UriWithId;

class CheckoutTest extends ApiTestCase
{
    use UriWithId;

    /**
     * Test checkout
     *
     * @return void
     *
     * @throws \Exception
     */
    public function testCheckout()
    {
        $this->assertFailed(null, 401, false);

        $this->login();

        $this->id = Order::TESTING_NOT_FOUND_ID;
        $this->assertFailed(null, 404, false);

        $order = factory(Order::class)->create();
        $this->id = $order->id;
        $cart = factory(Cart::class)->create();

        $this->assertFailed(null, 422)->assertJson([
            'message' => 'The cart is empty.',
        ]);

        $cart->restaurant_id = $order->restaurant_id;
        $cart->save();
        $this->assertSucceed(null)->assertJson([
            'subtotal' => 9.98,
            'tax' => 0.70,
            'delivery_fee' => 2.99,
        ]);

        $orderStatus = new OrderStatus([
            'status' => OrderStatus::CLOSED,
            'time' => Time::currentTime()->addMinutes(10),
        ]);
        $order->orderStatuses()->save($orderStatus);
        $this->assertFailed(null, 422)->assertJson([
            'message' => 'This order cannot be updated.',
        ]);
        $orderStatus->delete();

        $cart->cart = '[]';
        $cart->save();
        $this->assertFailed(null, 422)->assertJson([
            'message' => 'The cart is empty.',
        ], false);
    }

    protected function method()
    {
        return 'POST';
    }

    protected function uri()
    {
        return '/orders/{id}/checkout';
    }

    protected function tag()
    {
        return 'order';
    }

    protected function summary()
    {
        return 'Checkout. Calculate prices based on the cart.';
    }

    protected function rules()
    {
        return [];
    }
}
