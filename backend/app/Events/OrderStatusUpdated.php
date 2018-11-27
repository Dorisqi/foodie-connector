<?php

namespace App\Events;

use App\Models\OrderStatus;

class OrderStatusUpdated extends PushNotification
{
    /**
     * Create a new event instance.
     *
     * @param string $orderId
     * @param iterable $orderMembers
     * @param int $newStatus
     * @return void
     */
    public function __construct($orderId, $orderMembers, $newStatus)
    {
        $userIds = [];
        foreach ($orderMembers as $orderMember) {
            array_push($userIds, $orderMember->api_user_id);
        }
        parent::__construct('order-status-updated', [
            'order_id' => $orderId,
            'status' => OrderStatus::STATUS_NAMES[$newStatus],
        ], $userIds);
    }
}
