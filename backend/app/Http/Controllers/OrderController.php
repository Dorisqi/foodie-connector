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
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
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
     */
    public function index(Request $request)
    {
        $this->validateInput($request, $this::listRules());

        $orders = $this->query(
            true,
            $request->input('restaurant_id'),
            $request->input('order_status')
        )->get();
        return $this->response($orders);
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
        $this->validateInput($request);

        try {
            DB::beginTransaction();

            if ($this->query(
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

            $restaurant = Restaurant::find($request->input('restaurant_id'));

            $address = $this->user()->addresses()->find($request->input('address_id'));
            if (is_null($address)) {
                throw ApiException::invalidAddressId();
            }
            $restaurant->setAddress($address);
            if (!$restaurant->is_deliverable) {
                throw ApiException::validationFailedErrors([
                    'address_id' => [
                        'The address associated with the address_id must be deliverable by the restaurant.',
                    ],
                ]);
            }

            $createAt = Time::currentTime();
            $joinBefore = $createAt->copy()->addSeconds((int)$request->input('join_limit'));
            if (!$restaurant->isOpenAt($joinBefore->copy()->addMinute(10))) {
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
            if (App::environment('testing')) {
                $id = Order::TESTING_ID;
            } else {
                while (true) {
                    $id = strtoupper(bin2hex(openssl_random_pseudo_bytes(10)));
                    if (is_null(Order::find($id))) {
                        break;
                    }
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

        return $this->response($this->getOrder($order->id));
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
        $order = $this->getOrder($id);
        if (is_null($order) || !$order->is_visible) {
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
        $order = $this->getOrder($id);
        if (is_null($order) || !$order->is_visible) {
            throw ApiException::resourceNotFound();
        }
        if (!$order->is_creator) {
            throw ApiException::notOrderCreator();
        }
        foreach ($order->orderStatuses as $orderStatus) {
            if ($orderStatus->status > OrderStatus::CREATED) {
                throw ApiException::validationFailedErrors([
                    'id' => [
                        'The order corresponding to the id cannot be canceled',
                    ],
                ]);
            }
        }
        $orderStatus = new OrderStatus([
            'status' => OrderStatus::CLOSED,
            'time' => Time::currentTime(),
        ]);
        $orderStatus->order()->associate($order);
        $orderStatus->save();

        return $this->response($this->getOrder($id));
    }

    /**
     * Confirm an order
     *
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \App\Exceptions\ApiException
     */
    public function confirm($id)
    {
        $order = $this->getOrder($id);
        if (is_null($order) || !$order->is_visible) {
            throw ApiException::resourceNotFound();
        }
        if (!$order->is_creator) {
            throw ApiException::notOrderCreator();
        }
        foreach ($order->orderStatuses as $orderStatus) {
            if ($orderStatus->status > OrderStatus::CREATED) {
                throw ApiException::validationFailedErrors([
                    'id' => [
                        'The order corresponding to the id cannot be confirmed',
                    ],
                ]);
            }
        }
        // TODO: Check ready status
        $orderStatus = new OrderStatus([
            'status' => OrderStatus::CONFIRMED,
            'time' => Time::currentTime(),
        ]);
        $orderStatus->order()->associate($order);
        $orderStatus->save();

        return $this->response($this->getOrder($id));
    }

    /**
     * Show QRCode
     *
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function qrCode($id)
    {
        $order = Order::with('orderStatuses')->find($id);
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
        $order = $this->getOrder($id);
        if (is_null($order) || !$order->is_visible) {
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
                throw ApiException::validationFailedErrors([
                    'friend_id' => [
                        'The user is not your friend.',
                    ],
                ]);
            }
        }
        $receiver->notify(new OrderInvitation($this->user()->name, $order->share_link));
        return $this->response();
    }

    /**
     * Query order from the database
     *
     * @param int $id
     * @param bool $onlyMember [optional]
     * @return \App\Models\Order|null
     */
    protected function getOrder($id, $onlyMember = false)
    {
        return $this->query($onlyMember)->find($id);
    }

    /**
     * Return the query
     *
     * @param bool $onlyMember [optional]
     * @param int|null $restaurantId [optional]
     * @param string|null $orderStatus [optional]
     * @return Order|\Illuminate\Database\Eloquent\Builder
     */
    protected function query($onlyMember = true, $restaurantId = null, $orderStatus = null)
    {
        $query = Order::with([
            'restaurant',
            'creator:id,name',
            'orderMembers',
            'orderMembers.user:id,name',
            'orderStatuses' => function ($query) {
                $query->orderBy('time', 'desc');
            },
        ]);
        if ($onlyMember) {
            $user = $this->user();
            $query = $query->whereHas('orderMembers', function ($query) use ($user) {
                $query->where('api_user_id', $user->id);
            });
        }
        if ($restaurantId !== null) {
            $query = $query->where('restaurant_id', $restaurantId);
        }
        if ($orderStatus !== null) {
            $statusId = OrderStatus::STATUS_IDS[$orderStatus];
            $query = $query->whereDoesntHave(
                'orderStatuses',
                function ($query) use ($statusId) {
                    $query->where('status', '>', $statusId);
                }
            );
        }
        return $query;
    }

    public static function rules()
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
        return [
            'restaurant_id' => 'integer|exists:restaurants,id',
            'order_status' => 'string',
        ];
    }

    public static function inviteRules()
    {
        return [
            'email' => 'email',
            'friend_id' => 'required_without:email|string',
        ];
    }
}
