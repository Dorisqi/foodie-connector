<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class PushNotification implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $type;

    public $data;

    protected $userIds;

    /**
     * Create a new event instance.
     *
     * @param string $type
     * @param string|array|null $data
     * @param array $userIds
     * @return void
     */
    public function __construct($type, $data, $userIds)
    {
        $this->type = $type;
        $this->data = $data;
        $this->userIds = $userIds;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return array_map(function ($userId) {
            return new PrivateChannel("user.${userId}");
        }, $this->userIds);
    }

    public function broadcastAs()
    {
        return 'notification';
    }
}
