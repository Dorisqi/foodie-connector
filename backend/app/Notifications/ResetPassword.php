<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Auth\Notifications\ResetPassword as BaseResetPassword;

class ResetPassword extends BaseResetPassword
{
    /**
     * Create a notification instance.
     *
     * @param  string  $token
     * @return void
     */
    public function __construct($token)
    {
        parent::__construct($token);
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
            return call_user_func(static::$toMailCallback, $notifiable, $this->token);
        }

        return (new MailMessage)
            ->subject('Foodie Connector - Reset Password Notification')
            ->greeting($notifiable->name)
            ->line('You are receiving this email because we received a password reset request for your account.')
            ->line('Your verification code is')
            ->line($this->token)
            ->line('You can also click the link below.')
            ->action('Reset Password', url(config('app.url')))
            ->line('The code will be expired in 10 minutes.')
            ->line('If you did not request a password reset, no further action is required.');
    }
}
