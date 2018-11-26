<?php

namespace App\Models;

use App\Facades\Time;
use Carbon\Carbon;
use Grimzy\LaravelMysqlSpatial\Eloquent\SpatialTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class Order extends Model
{
    use SpatialTrait;

    public const TESTING_ID = 'HFEJ32RAFW58ER29R8SW';

    public $timestamps = false;

    public $incrementing = false;

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
                . "AND `status`=${createdStatusId}) as `created_at`"),
            DB::raw("(SELECT `status` FROM `order_statuses` WHERE `order_id`=`orders`.`id` ORDER BY `time` "
                . "DESC LIMIT 1) as `order_status`"),
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

    public function getShareLinkAttribute()
    {
        return url('orders/' . $this->id);
    }

    public function toArray()
    {
        $data = parent::toArray();
        $data['order_status'] = OrderStatus::STATUS_NAMES[$this->order_status];
        $data['share_link'] = $this->share_link;
        $data['qr_code_link'] = route('order.qr_code', ['id' => $this->id]);
        return $data;
    }
}
