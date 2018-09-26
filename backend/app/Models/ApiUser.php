<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Notifications\ResetPassword as ResetPasswordNotification;

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
        'password', 'created_at', 'updated_at'
    ];

    public function addresses()
    {
        return $this->hasMany('App\Models\Address');
    }

    public function defaultAddress()
    {
        return $this->hasOne('App\Models\Address', 'id', 'default_address');
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
     * Ignore setRememberToken
     *
     * @param string $value
     * @return void
     */
    public function setRememberToken($value)
    {
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
