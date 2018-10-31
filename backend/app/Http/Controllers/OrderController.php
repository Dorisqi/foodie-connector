<?php

namespace App\Http\Controllers;

use App\Exceptions\ApiException;
use App\Facades\Address;
use App\Facades\Time;
use App\Models\Order;
use App\Models\Restaurant;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class OrderController extends ApiController
{
    /**
     * Create a new group order
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \App\Exceptions\ApiException
     * @throws \Exception
     */
    public function store(Request $request)
    {
        $this->validateInput($request);

        try {
            DB::beginTransaction();
            $id = null;
            while (true) {
                $id = strtoupper(bin2hex(openssl_random_pseudo_bytes(3)));
                if (is_null(Order::find($id))) {
                    break;
                }
            }

            $restaurant = Restaurant::find($request->input('restaurant_id'));

            $address = $this->user()->addresses()->find($request->input('address_id'));
            if (is_null($address)) {
                throw ApiException::invalidAddressId();
            }
            $restaurant->setAddress($address);
            if (!$restaurant->is_deliverable) {
                throw ApiException::validationFailedErrors([
                    'address_id' => 'The address associated with the address_id must be deliverable by the restaurant.',
                ]);
            }

            $createAt = Time::currentTime();
            $joinBefore = $createAt->copy()->addSeconds((int)$request->input('join_limit'));
            if (!$restaurant->isOpenAt($joinBefore->copy()->addMinute(10))) {
                throw ApiException::validationFailedErrors([
                    'join_limit' => 'The restaurant must be open for at least 10 minutes after the join limit.'
                ]);
            }
            $order = new Order([
                'create_at' => $createAt->toDateTimeString(),
                'join_before' => $joinBefore->toDateTimeString(),
                'is_public' => $request['is_public'],
            ]);
            $order->id = $id;
            $order->restaurant()->associate($restaurant);
            $order->creator()->associate($this->user());

            if (!is_null($request->input('address_id'))) {
                $order->fill(
                    Address::addAddressPrefix(
                        \App\Models\Address::find($request->input('address_id'))->toArray()
                    )
                );
            } else {
                $order->fill($request->only(Address::addressFields()));
            }


            $order->save();

            DB::commit();
        } catch (\Exception $exception) {
            DB::rollBack();
            throw $exception;
        }

        return $this->response($order);
    }

    /**
     * Show the detail of an order
     *
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \App\Exceptions\ApiException
     */
    public function show($id)
    {
        $order = $this
            ->user()
            ->orders()
            ->with(['restaurant', 'creator:id,name'])
            ->find($id);
        if (is_null($order)) {
            throw ApiException::resourceNotFound();
        }
        return $this->response($order);
    }

    /**
     * Cancel an order
     *
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \App\Exceptions\ApiException
     */
    public function destroy($id)
    {
        $order = $this->user()->orders()->find($id);
        if (is_null($order)) {
            throw ApiException::resourceNotFound();
        }
        if (!is_null($order->close_at)) {
            throw ApiException::validationFailedErrors([
                'id' => 'The order corresponding to the id is already canceled',
            ]);
        }
        $order->close_at = (Carbon::now())->toDateTimeString();
        $order->save();
        return $this->response($order);
    }

    /**
     * Show QRCode
     *
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function qrCode($id)
    {
        // TODO: Cache
        $order = Order::find($id);
        if (is_null($order) || !$order->joinable) {
            throw abort(404);
        }
        $cacheKey = 'order_qr_code_cache:' . $order->id;
        $qrCode = Cache::get($cacheKey);
        if (is_null($qrCode)) {
            $qrCode = QrCode::size(150)->generate($order->share_link);
            Cache::put(
                $cacheKey,
                $qrCode,
                60
            );
        }
        return $qrCode;
    }

    public static function rules()
    {
        return array_merge([
            'restaurant_id' => 'required|integer|exists:restaurants,id',
            'join_limit' => 'required|integer|between:600,7200', // 10minutes - 2hours
            'is_public' => 'required|boolean',
            'address_id' => 'required|integer',
        ]);
    }
}
