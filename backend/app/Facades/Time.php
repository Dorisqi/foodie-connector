<?php

namespace App\Facades;

use Carbon\Carbon;

class Time
{
    protected static $currentTimeStamp = null;

    /**
     * Get the current timestamp
     *
     * @return int
     */
    public static function currentTimeStamp()
    {
        if (is_null(self::$currentTimeStamp)) {
            self::$currentTimeStamp = time();
        }
        return self::$currentTimeStamp;
    }

    /**
     * Get the current time in the format [hour, minute]
     *
     * @return \Carbon\Carbon
     */
    public static function currentTime()
    {
        return Carbon::createFromTimestamp(self::currentTimeStamp());
    }
}
