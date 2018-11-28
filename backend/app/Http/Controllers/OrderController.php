<?php

namespace App\Http\Controllers;

use App\Exceptions\ApiException;
use App\Facades\Address;
use App\Facades\Time;
use App\Models\Order;
use App\Models\OrderMember;
use App\Models\OrderStatus;
use App\Models\Restaurant;
use App\Notifications\OrderInvitation;
use Illuminate\Http\Request;
use Illuminate\Notifications\AnonymousNotifiable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class OrderController extends ApiController
{
    /**
     * List all orders
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \App\Exceptions\ApiException
     * @throws \App\Exceptions\MapsException
     */
    public function index(Request $request)
    {
        $this->validateInput($request, $this::listRules());

        $query = Order::query(
            true,
            $request->input('restaurant_id'),
            $request->input('order_status')
        );
        $coords = Address::parseCoords($request);
        if (!is_null($coords)) { // nearby orders
            $lat = (float)$coords->getLat();
            $lng = (float)$coords->getLng();
            $query = $query
                ->having('is_joinable', true)
                ->distanceSphere('geo_location', $coords, 500) // within 500 meters
                ->addSelect([
                    DB::raw("ROUND(ST_Distance_Sphere(`geo_location`, POINT(${lng}, ${lat}))) AS `distance`"),
                ]);
        }

        return $this->response($query->get());
    }

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
        $this->validateInput($request, $this::storeRules());

        try {
            DB::beginTransaction();

            if (Order::query(
                true,
                $request->input('restaurant_id'),
                'created'
            )->first() !== null) {
                throw ApiException::validationFailedErrors([
                    'form' => [
                        'You have unconfirmed order. Please confirm that before creating new one.'
                    ],
                ]);
            }

            $address = $this->user()->addresses()->find($request->input('address_id'));
            if (is_null($address)) {
                throw ApiException::invalidAddressId();
            }

            $restaurant = Restaurant::query($address->geo_location)->find($request->input('restaurant_id'));

            if (!$restaurant->is_deliverable) {
                throw ApiException::validationFailedErrors([
                    'address_id' => [
                        'The address associated with the address_id must be deliverable by the restaurant.',
                    ],
                ]);
            }

            $createAt = Time::currentTime();
            $joinBefore = $createAt->copy()->addSeconds((int)$request->input('join_limit'));

            if (!DB::selectOne(
                'SELECT ' . Restaurant::isOpenQuery($restaurant->id, $joinBefore->copy()->addMinutes(10))
            )->{'is_open'}) {
                throw ApiException::validationFailedErrors([
                    'join_limit' => [
                        'The restaurant must be open for at least 10 minutes after the join limit.',
                    ],
                ]);
            }

            $order = new Order([
                'join_before' => $joinBefore->toDateTimeString(),
                'is_public' => $request['is_public'],
            ]);

            $id = null;
            while (true) {
                $id = strtoupper(bin2hex(openssl_random_pseudo_bytes(10)));
                if (is_null(Order::find($id))) {
                    break;
                }
            }

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

            $orderMember = new OrderMember([
                'phone' => $order->phone,
            ]);
            $orderMember->user()->associate($this->user());
            $orderMember->order()->associate($order);
            $orderMember->save();

            $orderStatus = new OrderStatus([
                'status' => OrderStatus::CREATED,
                'time' => $createAt,
            ]);
            $orderStatus->order()->associate($order);
            $orderStatus->save();

            DB::commit();
        } catch (\Exception $exception) {
            DB::rollBack();
            throw $exception;
        }

        return $this->response(Order::query()->find($order->id));
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
        $order = Order::query(false)->find($id);
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
        $order = Order::query()->find($id);
        if (is_null($order)) {
            throw ApiException::resourceNotFound();
        }
        if (!$order->is_creator) {
            throw ApiException::notOrderCreator();
        }
        if ($order->order_status !== OrderStatus::CREATED) {
            throw ApiException::orderNotCancellable();
        }
        $order->updateStatus(OrderStatus::CLOSED);

        return $this->response(Order::query()->find($order->id));
    }

    /**
     * Join an order
     *
     * @param string $id
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \App\Exceptions\ApiException
     */
    public function join($id, Request $request)
    {
        $this->validateInput($request, $this::joinRules());
        $order = Order::query(false)->find($id);
        if (is_null($order)) {
            throw ApiException::resourceNotFound();
        }
        if (!$order->is_joinable) {
            throw ApiException::orderNotJoinable();
        }
        if ($order->is_member) {
            throw ApiException::orderAlreadyJoined();
        }
        $orderMember = new OrderMember([
            'phone' => $request->input('phone'),
        ]);
        $orderMember->user()->associate($this->user());
        $orderMember->order()->associate($order);
        $orderMember->save();

        return $this->response(Order::query()->find($order->id));
    }

    /**
     * Checkout
     *
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \App\Exceptions\ApiException
     */
    public function checkout($id)
    {
        $order = Order::query()->find($id);
        if (is_null($order)) {
            throw ApiException::resourceNotFound();
        }
        if ($order->order_status !== OrderStatus::CREATED) {
            throw ApiException::orderNotUpdatable();
        }
        $cart = $this->user()->cart()->first();
        if ($cart->restaurant_id !== $order->restaurant_id) {
            throw ApiException::emptyCart();
        }
        $cartItems = $cart->calculate();
        if (empty($cartItems)) {
            throw ApiException::emptyCart();
        }
        $orderMember = array_first($order->orderMembers, function ($value) {
            return $value->api_user_id === $this->user()->id;
        });
        if ($orderMember->is_ready) {
            throw ApiException::orderNotUpdatable();
        }
        $orderMember->fill([
            'products' => json_encode($cartItems),
            'subtotal' => (string)$cart->subtotal,
            'tax' => (string)$cart->tax,
            'delivery_fee' => (string)$order->prices['estimated_delivery_fee'],
        ])->save();
        return $this->response($orderMember);
    }

    /**
     * Pay the order and set as ready
     *
     * @param $id
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \App\Exceptions\ApiException
     */
    public function pay($id, Request $request)
    {
        $this->validateInput($request, $this::payRules());

        $order = Order::query()->find($id);
        if (is_null($order)) {
            throw ApiException::resourceNotFound();
        }
        $orderMember = array_first($order->orderMembers, function ($value) {
            return $value->api_user_id === $this->user()->id;
        });
        if ($orderMember->is_ready) {
            throw ApiException::orderAlreadyPaid();
        }
        if (is_null($orderMember->products)) {
            throw ApiException::orderNeedCheckout();
        }

        $tip = round((float)$request->input('tip'), 2);
        $total = round($orderMember->subtotal + $orderMember->tax + $tip + $orderMember->delivery_fee, 2);

        // TODO: Stripe payment

        $orderMember->fill([
            'is_ready' => 1,
            'tip' => (string)$tip,
            'total' => (string)$total,
        ])->save();
        return $this->response($orderMember);
    }

    /**
     * Confirm an order
     *
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \Exception
     */
    public function confirm($id)
    {
        $order = Order::query()->find($id);
        if (is_null($order)) {
            throw ApiException::resourceNotFound();
        }
        if (!$order->is_creator) {
            throw ApiException::notOrderCreator();
        }
        if ($order->order_status !== OrderStatus::CREATED) {
            throw ApiException::orderNotConfirmable();
        }

        try {
            DB::beginTransaction();

            $subtotal = 0;
            $deliveryFee = round($order->restaurant->delivery_fee / count($order->orderMembers), 2);
            foreach ($order->orderMembers as $orderMember) {
                if (!$orderMember->is_ready) {
                    throw ApiException::orderMemberNotReady();
                }
                $subtotal += $orderMember->subtotal;
                $orderMember->delivery_fee = $deliveryFee;
                $orderMember->total = round(
                    $orderMember->subtotal
                    + $orderMember->tax
                    + $orderMember->tip
                    + $deliveryFee,
                    2
                );
                $orderMember->save();
            }
            if ($subtotal < $order->restaurant->order_minimum) {
                throw ApiException::orderMinimumFailed();
            }

            $order->updateStatus(OrderStatus::CONFIRMED);

            DB::commit();
        } catch (\Exception $exception) {
            DB::rollBack();
            throw $exception;
        }

        return $this->response(Order::query()->find($order->id));
    }

    /**
     * Rate an order
     *
     * @param string $id
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \App\Exceptions\ApiException
     * @throws \Exception
     */
    public function rate($id, Request $request)
    {
        $this->validateInput($request, $this::rateRules());

        $order = Order::query()->find($id);
        if (is_null($order)) {
            throw ApiException::resourceNotFound();
        }

        if ($order->order_status !== OrderStatus::DELIVERED) {
            throw ApiException::orderNotRatable();
        }

        try {
            DB::beginTransaction();

            $orderMember = OrderMember::lockForUpdate()
                ->where('order_id', $order->id)
                ->where('api_user_id', $this->user()->id)
                ->first();
            $restaurant = Restaurant::lockForUpdate()->find($order->restaurant_id);

            $isPositive = $request->input('is_positive');
            if (is_null($orderMember->rate_is_positive)) {
                $restaurant->rate_count += 1;
            }
            if ($isPositive) {
                if (!$orderMember->rate_is_positive) {
                    $restaurant->rate_positive_count += 1;
                }
            } else {
                if ($orderMember->rate_is_positive) {
                    $restaurant->rate_positive_count -= 1;
                }
            }
            if ($restaurant->rate_count >= 5) {
                $restaurant->rating = 5 * $restaurant->rate_positive_count / $restaurant->rate_count;
            }
            $restaurant->save();
            $orderMember->rate_is_positive = $isPositive ? 1 : 0;
            $orderMember->save();

            DB::commit();

            return $this->response($orderMember);
        } catch (\Exception $exception) {
            DB::rollBack();
            throw $exception;
        }
    }

    /**
     * Show QRCode
     *
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function qrCode($id)
    {
        $order = Order::find($id);
        if (is_null($order)) {
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
        return response($qrCode)
            ->header('Content-Type', 'image/svg+xml');
    }

    /**
     * Invite
     *
     * @param string $id
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \App\Exceptions\ApiException
     */
    public function invite($id, Request $request)
    {
        $this->validateInput($request, $this::inviteRules());
        $order = Order::query()->find($id);
        if (is_null($order)) {
            throw ApiException::resourceNotFound();
        }
        if (!$order->is_member) {
            throw ApiException::notOrderMember();
        }
        if (!$order->is_joinable) {
            throw ApiException::orderNotJoinable();
        }
        if ($request->has('email')) {
            $receiver = new AnonymousNotifiable();
            $receiver->route('mail', $request->input('email'));
        } else {
            $receiver = $this->user()->friends()
                ->where('friends.friend_id', $request->input('friend_id'))->first();
            if (is_null($receiver)) {
                throw ApiException::notFriend();
            }
        }
        $receiver->notify(new OrderInvitation($this->user()->name, $order->share_link));
        return $this->response();
    }

    public static function storeRules()
    {
        return [
            'restaurant_id' => 'required|integer|exists:restaurants,id',
            'join_limit' => 'required|integer|between:600,7200', // 10minutes - 2hours
            'is_public' => 'required|boolean',
            'address_id' => 'required|integer',
        ];
    }

    public static function listRules()
    {
        return array_merge(Address::rules(true, false), [
            'restaurant_id' => 'integer|exists:restaurants,id',
            'order_status' => [
                'string',
                Rule::in(array_keys(OrderStatus::STATUS_IDS)),
            ],
        ]);
    }

    public static function inviteRules()
    {
        return [
            'email' => 'email',
            'friend_id' => 'required_without:email|string',
        ];
    }

    public static function joinRules()
    {
        return [
            'phone' => 'required|phone:US',
        ];
    }

    public static function payRules()
    {
        return [
            'tip' => 'required|numeric',
            'card_id' => [
                'required',
                'integer',
                Rule::exists('cards', 'id')->where(function ($query) {
                    $query->where('api_user_id', Auth::guard('api')->user()->id);
                }),
            ],
        ];
    }

    public static function rateRules()
    {
        return [
            'is_positive' => 'required|boolean',
        ];
    }
}
