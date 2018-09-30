<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail as BaseVerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;

class VerifyEmail extends BaseVerifyEmail
{
    /**
     * Verification token
     *
     * @var string
     */
    public $token;

    /**
     * Construct a new notification
     *
     * @param string $token
     * @return void
     */
    public function __construct(string $token)
    {
        $this->token = $token;
    }

    /**
     * Build the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        if (static::$toMailCallback) {
            return call_user_func(static::$toMailCallback, $notifiable);
        }

        return (new MailMessage())
            ->subject('Foodie Connector - Verify Email Address')
            ->greeting($notifiable->name)
            ->line('Please click the button below to verify your email address.')
            ->action(
                'Verify Email Address ' . $this->token,
                'localhost'
            )
            ->line('The link will be expired in 24 hours');
    }
}
