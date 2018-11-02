<?php

namespace App\Brokers;

use App\Exceptions\ApiException;
use App\Models\ApiUser;
use Illuminate\Cache\RateLimiter;
use Illuminate\Support\Facades\Redis;
use \Closure;

class VerifyEmailBroker
{
    /**
     * Send the verification email
     *
     * @param \Illuminate\Cache\RateLimiter
     * @param \App\Models\ApiUser $user
     * @return void
     *
     * @throws \Exception
     */
    public static function sendVerificationEmail(RateLimiter $limiter, ApiUser $user)
    {
        $user->sendEmailVerificationNotificationEmail(
            self::generateVerificationToken($user)
        );
        $limiter->hit($user->emailThrottleKey(), config('auth.guards.api.email.decay_minutes'));
    }

    /**
     * Verify the email
     *
     * @param string $encodedToken
     * @param \Closure $verifyEmailCallback
     * @return void
     *
     * @throws \App\Exceptions\ApiException
     */
    public static function verify(string $encodedToken, Closure $verifyEmailCallback)
    {
        $decodedToken = self::decodeToken($encodedToken);
        if (is_null($decodedToken)) {
            throw ApiException::invalidEmailVerificationToken();
        }

        $verifyEmailCallback($decodedToken['user_id']);
        Redis::del(self::redisKey($decodedToken['user_id'], $decodedToken['token']));
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
            self::redisKey($user->getAuthIdentifier(), $token),
            true,
            'NX',
            'EX',
            self::config()['expires']
        ))) {
            return self::generateVerificationToken($user);
        }
        return base64_encode($token . $user->getAuthIdentifier());
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
     * @param int $userId
     * @param string $token
     * @return string
     */
    public static function redisKey(int $userId, string $token)
    {
        return self::config()['storage_key'] . ':' . $userId . ':' . $token;
    }

    /**
     * Decode the token
     *
     * @param string $encodedToken
     * @return array|null
     */
    protected static function decodeToken(string $encodedToken)
    {
        $decodedToken = base64_decode($encodedToken);
        if (!$decodedToken) {
            return null;
        }
        $token = substr($decodedToken, 0, self::config()['token_bytes'] * 2);
        if (!$token) {
            return null;
        }
        $userId = substr($decodedToken, self::config()['token_bytes'] * 2);
        if (!$userId) {
            return null;
        }
        $token_exists = Redis::get(self::redisKey($userId, $token));
        if (is_null($token_exists)) {
            return null;
        }
        return [
            'token' => $token,
            'user_id' => $userId,
        ];
    }
}
