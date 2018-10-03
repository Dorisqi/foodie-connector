<?php

namespace App\Http\Controllers;

use App\Exceptions\ApiException;
use App\Models\Card;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Stripe\Error\InvalidRequest;

class CardController extends ApiController
{
    /**
     * Create a new controller instance
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('stripe')->only([
            'store',
        ]);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        return $this->response($this->user()->cards);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \App\Exceptions\ApiException
     * @throws \Exception
     */
    public function store(Request $request)
    {
        $this->validateInput($request, $this::storeRules());

        try {
            DB::beginTransaction();

            $user = $this->user();
            $customer = \Stripe\Customer::retrieve($user->stripe_id);

            try {
                $source = $customer->sources->create([
                    'source' => $request->input('token')
                ]);
            } catch (InvalidRequest $exception) {
                throw ApiException::invalidStripeToken();
            }

            $card = new Card([
                'nickname' => $request->input('nickname'),
                'brand' => $source->brand,
                'last_four' => $source->last4,
                'expiration_month' => $source->exp_month,
                'expiration_year' => $source->exp_year,
                'zip_code' => $source->address_zip,
                'stripe_id' => $source->id,
            ]);
            $user->cards()->save($card);

            if ($request->input('is_default') === true
                || is_null($user->defaultCard)) {
                $card->is_default = true;
            }

            DB::commit();
        } catch (\Exception $exception) {
            DB::rollBack();
            throw $exception;
        }

        return $this->response($card);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    /**
     * Get the rules for updating card
     *
     * @return array
     */
    public static function updateRules()
    {
        return [
            'nickname' => 'string|max:255',
            'expiration_month' => 'integer|between:1,12',
            'expiration_year' => 'numeric|between:1,31',
            'zip_code' => 'zip_code'
        ];
    }

    /**
     * Get the rules for storing card
     *
     * @return array
     */
    public static function storeRules()
    {
        return [
            'nickname' => 'required|string|max:255',
            'token' => 'required|string|max:255',
            'is_default' => 'required|boolean'
        ];
    }
}
