<?php

namespace App\Http\Controllers;

use App\Exceptions\ApiException;
use App\Models\Card;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Stripe\Customer;
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
            'store', 'destroy', 'update'
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
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \App\Exceptions\ApiException
     */
    public function show($id)
    {
        $card = $this->user()->cards()->find($id);
        if (is_null($card)) {
            throw ApiException::resourceNotFound();
        }
        return $this->response($card);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \App\Exceptions\ApiException
     * @throws \Exception
     */
    public function update(Request $request, $id)
    {
        $card = $this->user()->cards->find($id);
        if (is_null($card)) {
            throw ApiException::resourceNotFound();
        }

        $this->validateInput($request, $this::updateRules());
        if ($request->has(['expiration_month', 'expiration_year'])) {
            $expMonth = (int)$request->input('expiration_month');
            $expYear = (int)$request->input('expiration_year');
            $now = Carbon::now();
            if ($expYear < $now->year) {
                throw ApiException::expirationYearPassed();
            } elseif ($expYear == $now->year && $expMonth < $now->month) {
                throw ApiException::expirationMonthPassed();
            }
        }

        try {
            DB::beginTransaction();

            if (!App::environment('testing')) {
                $customer = Customer::retrieve($this->user()->stripe_id);
                $source = $customer->sources->retrieve($card->stripe_id);
                if ($request->has('expiration_month')) {
                    $source->exp_month = $request->input('expiration_month');
                }
                if ($request->has('expiration_year')) {
                    $source->exp_year = $request->input('expiration_year');
                }
                if ($request->has('zip_code')) {
                    $source->address_zip = $request->input('zip_code');
                }
                $source->save();
                // TODO: Improve testing
            }

            if ($request->has('expiration_month')) {
                $card->expiration_month = $request->input('expiration_month');
            }
            if ($request->has('expiration_year')) {
                $card->expiration_year = $request->input('expiration_year');
            }
            if ($request->has('zip_code')) {
                $card->zip_code = $request->input('zip_code');
            }
            if ($request->has('nickname')) {
                $card->nickname = $request->input('nickname');
            }
            $card->save();

            if ($request->input('is_default') === true) {
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
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \Exception
     */
    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $user = $this->user();
            $card = $user->cards()->find($id);
            if (is_null($card)) {
                throw ApiException::resourceNotFound();
            }

            if ($card->is_default) {
                $newDefaultCard = $user->cards()->where('id', '<>', $id)->orderByDesc('id')->first();
                if (is_null($newDefaultCard)) {
                    $user->default_card_id = null;
                    $user->save();
                } else {
                    $newDefaultCard->is_default = true;
                }
            }

            if (!App::environment('testing')) {
                $customer = Customer::retrieve($user->stripe_id);
                $customer->sources->retrieve($card->stripe_id)->delete();
                // TODO: Improve sources testing
            }

            $card->delete();

            DB::commit();
        } catch (\Exception $exception) {
            DB::rollBack();
            throw $exception;
        }
        return $this->response();
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
            'expiration_year' => 'integer|digits:4',
            'zip_code' => 'nullable|integer',
            'is_default' => 'boolean',
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
