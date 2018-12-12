<?php

namespace Tests\Feature\Order;

use App\Http\Controllers\OrderController;
use App\Models\Card;
use App\Models\Cart;
use App\Models\Order;
use Tests\ApiTestCase;
use Tests\UriWithId;

class PayTest extends ApiTestCase
{
    use UriWithId;

    /**
     * Test paying for order
     *
     * @return void
     */
    public function testPay()
    {
        $this->assertFailed(null, 401, false);

        $this->login();

        $this->assertFailed(null, 422)->assertJson([
            'message' => 'Validation failed.',
        ]);

        $card = factory(Card::class)->create();

        $this->id = Order::TESTING_NOT_FOUND_ID;
        $this->assertFailed([
            'tip' => 2,
            'card_id' => $card->id,
        ], 404);

        $order = factory(Order::class)->create();
        $this->id = $order->id;
        $this->assertFailed([
            'tip' => 2,
            'card_id' => $card->id,
        ], 422)->assertJson([
            'message' => 'This order requires checkout.',
        ]);
        $cart = factory(Cart::class)->create([
            'restaurant_id' => $order->restaurant_id,
        ]);
        $orderMember = $order->orderMembers[0];
        $orderMember->fill([
            'products' => json_encode($cart->calculate()),
            'subtotal' => 9.98,
            'tax' => 0.70,
            'delivery_fee' => 2.99,
        ])->save();
        $this->assertSucceed([
            'tip' => 2,
            'card_id' => $card->id,
        ])->assertJson([
            'is_ready' => 1,
            'total' => 15.67,
        ]);
        $this->assertFailed([
            'tip' => 2,
            'card_id' => $card->id,
        ], 422)->assertJson([
            'message' => 'This order is already paid.',
        ]);
    }

    protected function method()
    {
        return 'POST';
    }

    protected function uri()
    {
        return '/orders/{id}/pay';
    }

    protected function tag()
    {
        return 'order';
    }

    protected function summary()
    {
        return 'Pay for an order.';
    }

    protected function rules()
    {
        return OrderController::payRules();
    }
}
