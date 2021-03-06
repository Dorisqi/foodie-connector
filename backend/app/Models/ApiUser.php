<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Notifications\ResetPassword as ResetPasswordNotification;
use App\Notifications\VerifyEmail as VerifyEmailNotification;
use Illuminate\Support\Facades\Auth;

class ApiUser extends Authenticatable
{
    use Notifiable;

    public const TESTING_FRIEND_ID = 'FRIEND';

    protected $dateFormat = 'Y-m-d H:i:s';

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
        'name', 'email', 'password', 'stripe_id', 'friend_id'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'id',
        'password',
        'email_verified_at',
        'created_at',
        'updated_at',
        'default_address_id',
        'default_card_id',
        'stripe_id',
    ];

    public function addresses()
    {
        return $this->hasMany('App\Models\Address');
    }

    public function defaultAddress()
    {
        return $this->hasOne('App\Models\Address', 'id', 'default_address_id');
    }

    public function cards()
    {
        return $this->hasMany('App\Models\Card');
    }

    public function defaultCard()
    {
        return $this->hasOne('App\Models\Card', 'id', 'default_card_id');
    }

    public function cart()
    {
        return $this->hasOne(Cart::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'creator_id');
    }

    public function friends()
    {
        return $this->belongsToMany(
            ApiUser::class,
            'friends',
            'api_user_id',
            'friend_id',
            'id',
            'friend_id'
        );
    }

    public function getIsEmailVerifiedAttribute()
    {
        return !is_null($this->email_verified_at);
    }

    public function toArray($showId = false)
    {
        if ($this->id !== Auth::guard('api')->user()->id) {
            return [
                'name' => $this->name,
                'email' => $this->email,
                'friend_id' => $this->friend_id,
            ];
        }
        $data = parent::toArray();
        if ($showId) {
            $data['id'] = $this->id;
        }
        if (!is_null($this->email)) {
            $data['is_email_verified'] = $this->is_email_verified;
        }
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
