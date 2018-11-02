<?php

namespace App\Http\Controllers;

use App\Exceptions\ApiException;
use App\Models\Cart;
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
        $cart = $this->user()->cart()->first();
        if (is_null($cart)) {
            $cart = new Cart();
            $cart->user()->associate($this->user()->id);
        }
        $cart->restaurant()->associate($request->input('restaurant_id'));
        try {
            $cart->calculateSummary(true, $request->input('cart'));
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
        $cart = $this->user()->cart()->first();
        if (is_null($cart)) {
            return $this->response([
                'restaurant_id' => null,
                'cart' => [],
                'subtotal' => 0,
            ]);
        }
        return $this->response($cart);
    }

    public static function rules()
    {
        return [
            'restaurant_id' => 'required|integer|exists:restaurants,id',
            'cart' => 'required|array',
        ];
    }
}
