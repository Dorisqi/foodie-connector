<?php

namespace App\Brokers;

use App\Models\ApiUser;
use Illuminate\Support\Facades\Redis;

class VerifyEmailBroker
{
    /**
     * Send the verification email
     *
     * @param \App\Models\ApiUser $user
     * @return void
     *
     * @throws \Exception
     */
    public static function sendVerificationEmail(ApiUser $user)
    {
        $user->sendEmailVerificationNotificationEmail(
            self::generateVerificationToken($user)
        );
    }

    /**
     * Generate the verification token
     *
     * @param \App\Models\ApiUser $user
     * @return string
     *
     * @throws \Exception
     */
    protected static function generateVerificationToken(ApiUser $user)
    {
        $token = bin2hex(openssl_random_pseudo_bytes(self::config()['token_bytes']));
        if (is_null(Redis::set(
            self::redisKey($user, $token),
            true,
            'NX',
            'EX',
            self::config()['expires']
        ))) {
            return self::generateVerificationToken($user);
        }
        return $token;
    }

    /**
     * Get the parent configuration
     *
     * @return array
     */
    protected static function config()
    {
        return config('auth.guards.api.verify_email');
    }

    /**
     * Get Redis key
     *
     * @param \App\Models\ApiUser $user
     * @param string $token
     * @return string
     */
    protected static function redisKey(ApiUser $user, string $token)
    {
        return self::config()['storage_key'] . ':' .
            $user->getAuthIdentifier() . ':' .
            $token;
    }
}
