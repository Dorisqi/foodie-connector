<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Notifications\ResetPassword as ResetPasswordNotification;
use App\Notifications\VerifyEmail as VerifyEmailNotification;

class ApiUser extends Authenticatable
{
    use Notifiable;

    /**
     * The column name of the remember tokens
     *
     * @var string
     */
    protected $remember_column = '';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'email_verified_at', 'created_at', 'updated_at', 'default_address_id', 'default_card_id'
    ];

    public function addresses()
    {
        return $this->hasMany('App\Models\Address');
    }

    public function defaultAddress()
    {
        return $this->hasOne('App\Models\Address', 'id', 'default_address_id');
    }

    public function getIsEmailVerifiedAttribute()
    {
        return !is_null($this->email_verified_at);
    }

    public function toArray()
    {
        $data = parent::toArray();
        $data['is_email_verified'] = $this->is_email_verified;
        return $data;
    }

    /**
     * Send the password reset notification.
     *
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token));
    }

    /**
     * Send the email verification notification.
     *
     * @param string $token
     * @return void
     */
    public function sendEmailVerificationNotificationEmail($token)
    {
        $this->notify(new VerifyEmailNotification($token));
    }

    /**
     * Ignore setRememberToken
     *
     * @param string $value
     * @return void
     */
    public function setRememberToken($value)
    {
    }

    /**
     * Get throttle key for send emails
     *
     * @return string
     */
    public function emailThrottleKey()
    {
        return 'send_email|' . $this->email;
    }

    /**
     * Get the throttle key for resetting password
     *
     * @return string
     */
    public function resetPasswordThrottleKey()
    {
        return 'reset_password|' . $this->email;
    }

    /**
     * Return password for testing
     *
     * @return string
     */
    public static function testingPassword()
    {
        return 'test123456';
    }
}
