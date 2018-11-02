<?php

namespace App\Facades;

class ApiThrottle
{
    /**
     * Generate a throttle header
     *
     * @param int $rateLimit
     * @param int $retriesLeft
     * @param int|null $retryAfter [optional]
     * @return array
     */
    public static function throttleHeaders(int $rateLimit, int $retriesLeft, $retryAfter = null)
    {
        $headers = [
            'X-RateLimit-Limit' => $rateLimit,
            'X-RateLimit-Remaining' => $retriesLeft,
        ];
        if ($retriesLeft === 0) {
            $headers['Retry-After'] = $retryAfter;
        }
        return $headers;
    }
}
