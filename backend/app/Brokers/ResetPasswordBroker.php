<?php

namespace App\Brokers;

use App\Exceptions\ApiException;
use App\Models\ApiUser;
use Illuminate\Support\Facades\Redis;
use Closure;

class ResetPasswordBroker
{
    /**
     * Storage key
     */
    protected const STORAGE_KEY = 'password_reset_token';

    /**
     * Expiration time in seconds
     */
    protected const EXPIRES = 600;

    /**
     * Send reset code and link through email
     *
     * @param \App\Models\ApiUser $user
     * @return void
     *
     * @throws \App\Exceptions\ApiException
     * @throws \Exception
     */
    public static function sendResetEmail(ApiUser $user)
    {
        if (is_null($user)) {
            throw ApiException::userNotFound();
        }
        $user->sendPasswordResetNotification(
            self::generateResetToken($user)
        );
    }

    /**
     * Reset password
     *
     * @param array $credentials
     * @param \Closure $callback
     * @return void
     *
     * @throws \App\Exceptions\ApiException
     */
    public static function reset(array $credentials, Closure $callback)
    {
        $user = ApiUser::where('email', $credentials['email'])->first();
        if (is_null($user)) {
            throw ApiException::userNotFound();
        }

        $token_exists = Redis::get(self::redisKey($user, $credentials['token']));
        if (is_null($token_exists)) {
            throw ApiException::invalidToken();
        }

        $callback($user, $credentials['password']);
        Redis::del(self::redisKey($user, $credentials['token']));
    }

    /**
     * Generate reset token
     *
     * @param \App\Models\ApiUser $user
     * @return string
     *
     * @throws \Exception
     */
    protected static function generateResetToken(ApiUser $user)
    {
        $token = sprintf('%08d', random_int(0, 99999999));
        if (is_null(Redis::set(
            self::redisKey($user, $token),
            true,
            'NX',
            'EX',
            self::EXPIRES
        ))) {
            return self::generateResetToken($user);
        }
        return $token;
    }

    /**
     * Get Redis key
     *
     * @param \App\Models\ApiUser $user
     * @param string $token
     * @return string
     */
    public static function redisKey(ApiUser $user, string $token)
    {
        return self::STORAGE_KEY . ':' .
            $user->getAuthIdentifier() . ':' .
            $token;
    }
}
