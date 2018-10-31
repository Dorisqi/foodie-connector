<?php

namespace App\Facades;

class Time
{
    protected static $currentTimeStamp = null;
    protected static $currentDayOfWeek = null;
    protected static $currentTime = null;

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
     * Get the current day of week
     *
     * @return int
     */
    public static function currentDayOfWeek()
    {
        if (is_null(self::$currentDayOfWeek)) {
            self::$currentDayOfWeek = (int)date('w', self::currentTimeStamp());
        }
        return self::$currentDayOfWeek;
    }

    /**
     * Get the current time in the format [hour, minute]
     *
     * @return array
     */
    public static function currentTime()
    {
        if (is_null(self::$currentTime)) {
            self::$currentTime = self::parseTime(date('G:i', self::currentTimeStamp()));
        }
        return self::$currentTime;
    }

    /**
     * Parse string time into a array in the format [hour, minute]
     *
     * @param string $time
     * @return array
     */
    public static function parseTime(string $time)
    {
        $timeExploded = explode(':', $time);
        return [
            (int)$timeExploded[0],
            (int)$timeExploded[1],
        ];
    }

    /**
     * Return if time1 is before to time 2
     *
     * @param array $time1
     * @param array $time2
     * @return bool
     */
    public static function isBefore(array $time1, array $time2)
    {
        if ($time1[0] == $time2[0]) {
            return $time1[1] < $time2[1];
        }
        return $time1[0] < $time2[0];
    }
}
