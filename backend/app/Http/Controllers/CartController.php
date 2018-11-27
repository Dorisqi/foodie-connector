<?php

namespace App\Http\Controllers;

use App\Exceptions\ApiException;
use App\Models\Cart;
use App\Models\Restaurant;
use Illuminate\Http\Request;

class CartController extends ApiController
{
    /**
     * Update the cart
     *
     * @param \Illuminate\Http\Request
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \App\Exceptions\ApiException
     * @throws \Exception
     */
    public function update(Request $request)
    {
        $this->validateInput($request);
        $cart = $this->user()->cart()->with('restaurant')->first();
        if (is_null($cart)) {
            $cart = new Cart();
            $cart->user()->associate($this->user()->id);
        }
        if (is_null($request->input('restaurant_id'))) {
            $cart->restaurant()->dissociate();
        } else {
            $cart->restaurant()->associate(Restaurant::find($request->input('restaurant_id')));
        }
        try {
            $cart->calculate(true, $request->input('cart'));
        } catch (\Exception $exception) {
            if (config('app.debug')) {
                throw ApiException::validationFailedErrors([
                    'cart' => [
                        'Invalid cart',
                        $exception->getMessage(),
                        $exception->getTraceAsString(),
                    ],
                ]);
            } else {
                throw ApiException::validationFailedErrors([
                    'cart' => [
                        'Invalid cart',
                    ],
                ]);
            }
        }
        return $this->response($cart);
    }

    /**
     * Show the cart
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function show()
    {
        $cart = $this->user()->cart()->with('restaurant')->first();
        if (is_null($cart)) {
            return $this->response(new Cart([
                'cart' => '[]'
            ]));
        }
        return $this->response($cart);
    }

    public static function rules()
    {
        return [
            'restaurant_id' => 'integer|nullable|exists:restaurants,id',
            'cart' => 'array|nullable',
        ];
    }
}
