<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderInvitation extends Notification
{
    /**
     * Initiator
     *
     * @var string
     */
    public $initiator;

    /**
     * Order link
     *
     * @var string
     */
    public $orderLink;

    /**
     * Construct a new notification
     *
     * @param string $initiator
     * @param string $orderLink
     * @return void
     */
    public function __construct(string $initiator, string $orderLink)
    {
        $this->initiator = $initiator;
        $this->orderLink = $orderLink;
    }

    /**
     * Get the notification's channels.
     *
     * @param  mixed  $notifiable
     * @return array|string
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Build the mail representation of the notification.
     *
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail()
    {
        return (new MailMessage())
            ->subject('Foodie Connector - Group Order Invitation')
            ->line('Your friend ' . $this->initiator . ' has invited you to join a group delivery order.')
            ->action(
                'Join Order Now',
                $this->orderLink
            );
    }
}
