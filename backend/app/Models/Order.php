<?php

namespace App\Models;

use App\Events\OrderStatusUpdated;
use App\Facades\Time;
use Grimzy\LaravelMysqlSpatial\Eloquent\SpatialTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class Order extends Model
{
    use SpatialTrait;

    public const TESTING_ID = 'HFEJ32RAFW58ER29R8SW';
    public const TESTING_NOT_FOUND_ID = 'NOTFOUND83FD83IRUDO2';

    public $timestamps = false;

    public $incrementing = false;

    protected $casts = [
        'is_public' => 'bool',
        'is_creator' => 'bool',
        'is_member' => 'bool',
        'is_joinable' => 'bool',
        'is_visible' => 'bool',
    ];

    protected $fillable = [
        'join_before',
        'is_public',
        'address_line_1',
        'address_line_2',
        'city',
        'state',
        'zip_code',
        'geo_location',
        'phone',
    ];

    protected $hidden = [
        'restaurant_id', 'creator_id',
    ];

    protected $spatialFields = [
        'geo_location',
    ];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function creator()
    {
        return $this->belongsTo(ApiUser::class);
    }

    public function orderMembers()
    {
        return $this->hasMany(OrderMember::class);
    }

    public function orderStatuses()
    {
        return $this->hasMany(OrderStatus::class);
    }

    /**
     * Return the query
     *
     * @param bool $onlyMember [optional]
     * @param int|null $restaurantId [optional]
     * @param string|null $orderStatus [optional]
     * @param bool $onlyVisible [optional]
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public static function query($onlyMember = true, $restaurantId = null, $orderStatus = null, $onlyVisible = true)
    {
        $userId = Auth::guard('api')->user()->id;
        $currentTime = Time::currentTime()->toDateTimeString();
        $createdStatusId = OrderStatus::CREATED;
        $query = Order::with([
            'restaurant',
            'creator:id,name,friend_id',
            'orderMembers',
            'orderMembers.user:id,name,friend_id',
            'orderStatuses' => function ($query) {
                $query->orderBy('time', 'desc');
            },
        ])->addSelect([
            '*',
            DB::raw("(SELECT `time` FROM `order_statuses` WHERE `order_id`=`orders`.`id` "
                . "AND `status`=${createdStatusId} LIMIT 1) as `created_at`"),
            self::orderStatusQuery(),
            DB::raw("(`creator_id`=${userId}) as `is_creator`"),
            DB::raw("EXISTS(SELECT * FROM `order_members` WHERE `order_id`=`orders`.`id` AND "
                . "`api_user_id`=${userId}) as `is_member`"),
            DB::raw("((SELECT `order_status`)=${createdStatusId} AND `join_before`>='${currentTime}') "
                . "as `is_joinable`"),
            DB::raw("((SELECT `is_joinable`) OR (SELECT `is_member`)) as `is_visible`"),
        ])->orderByDesc('created_at');
        if ($onlyMember) {
            $user = Auth::guard('api')->user();
            $query = $query->whereHas('orderMembers', function ($query) use ($user) {
                $query->where('api_user_id', $user->id);
            });
        }
        if ($onlyVisible) {
            $query = $query->having('is_visible', true);
        }
        if ($restaurantId !== null) {
            $query = $query->where('restaurant_id', $restaurantId);
        }
        if ($orderStatus !== null) {
            $statusId = OrderStatus::STATUS_IDS[$orderStatus];
            $query = $query->having('order_status', $statusId);
        }
        return $query;
    }

    public static function orderStatusQuery()
    {
        return DB::raw("(SELECT `status` FROM `order_statuses` WHERE `order_id`=`orders`.`id` ORDER BY `time` "
            . "DESC LIMIT 1) as `order_status`");
    }

    public function getShareLinkAttribute()
    {
        return url('orders/' . $this->id);
    }

    protected $localPrices = null;

    public function getPricesAttribute()
    {
        if (is_null($this->restaurant)) {
            return null;
        }
        $total = 0;
        foreach ($this->orderMembers as $orderMember) {
            if (is_null($orderMember->total)) {
                $total = null;
                break;
            }
            $total += $orderMember->total;
        }
        if (is_null($this->localPrices)) {
            $this->localPrices = [
                'estimated_delivery_fee' => $this->order_status === OrderStatus::CREATED
                    ? round($this->restaurant->delivery_fee / count($this->orderMembers), 2)
                    : null,
                'total' => $total,
            ];
        }
        return $this->localPrices;
    }

    public function getCurrentOrderMemberAttribute()
    {
        if (is_null($this->orderMembers)) {
            return null;
        }
        $userId = Auth::guard('api')->user()->id;
        return array_first($this->orderMembers, function ($orderMember) use ($userId) {
            return $orderMember->api_user_id === $userId;
        });
    }

    public function updateStatus($status)
    {
        $this->orderStatuses()->create([
            'status' => $status,
            'time' => Time::currentTime(),
        ]);
        if ($status !== OrderStatus::CREATED) {
            event(new OrderStatusUpdated($this->id, $this->orderMembers, $status));
        }
    }

    public function toArray()
    {
        $data = parent::toArray();
        $data['order_status'] = OrderStatus::STATUS_NAMES[$this->order_status];
        $data['share_link'] = $this->share_link;
        $data['qr_code_link'] = route('order.qr_code', ['id' => $this->id]);
        $data['prices'] = $this->prices;
        $data['current_order_member'] = $this->current_order_member;
        return $data;
    }
}
