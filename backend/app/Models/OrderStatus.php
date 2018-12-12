<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderStatus extends Model
{
    public const CREATED = 0;
    public const CLOSED = 1;
    public const CONFIRMED = 2;
    public const PREPARING = 3;
    public const DELIVERING = 4;
    public const DELIVERED = 5;
    public const STATUS_NAMES = [
        self::CREATED => 'created',
        self::CLOSED => 'closed',
        self::CONFIRMED => 'confirmed',
        self::PREPARING => 'preparing',
        self::DELIVERING => 'delivering',
        self::DELIVERED => 'delivered',
    ];
    public const STATUS_IDS = [
        'created' => self::CREATED,
        'closed' => self::CLOSED,
        'confirmed' => self::CONFIRMED,
        'preparing' => self::PREPARING,
        'delivering' => self::DELIVERING,
        'delivered' => self::DELIVERED,
    ];

    public $timestamps = false;

    protected $fillable = [
        'status', 'time',
    ];

    protected $hidden = [
        'id', 'order_id',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function getStatusNameAttribute()
    {
        return $this::STATUS_NAMES[$this->status];
    }

    public function toArray()
    {
        $data = parent::toArray();
        $data['status'] = $this->status_name;
        return $data;
    }
}
