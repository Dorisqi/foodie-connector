<?php

namespace App\Models;

use App\Facades\Time;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Order extends Model
{
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
        'lat',
        'lng',
        'phone',
    ];

    protected $hidden = [
        'restaurant_id', 'creator_id',
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

    public function getShareLinkAttribute()
    {
        return url('orders/' . $this->id);
    }

    public function getIsJoinableAttribute()
    {
        if (Time::currentTime()->greaterThan(
            is_numeric($this->join_before)
                ? Carbon::createFromTimestamp($this->join_before)
                : Carbon::parse($this->join_before)
        )) {
            return false;
        }
        foreach ($this->orderStatuses as $orderStatus) {
            if ($orderStatus->status > OrderStatus::CREATED) {
                return false;
            }
        }
        return true;
    }

    public function getIsVisibleAttribute()
    {
        if ($this->is_joinable) {
            return true;
        }
        foreach ($this->orderMembers as $orderMember) {
            if ($orderMember->user->id === Auth::guard('api')->user()->id) {
                return true;
            }
        }
        return false;
    }

    public function toArray()
    {
        $data = parent::toArray();
        $data['is_joinable'] = $this->is_joinable;
        $data['share_link'] = $this->share_link;
        $data['qr_code_link'] = route('order.qr_code', ['id' => $this->id]);
        return $data;
    }
}
