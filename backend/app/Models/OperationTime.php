<?php

namespace App\Models;

use App\Facades\Time;
use Illuminate\Database\Eloquent\Model;

class OperationTime extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'day_of_week',
        'start_time',
        'end_time',
    ];

    protected $hidden = [
        'id', 'restaurant_id',
    ];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }

    /**
     * Return whether the current timestamp is in the operation time
     *
     * @return bool
     */
    public function contains()
    {
        $currentDayOfWeek = Time::currentDayOfWeek();
        $currentTime = Time::currentTime();
        if ($currentDayOfWeek !== $this->day_of_week && $currentDayOfWeek !== ($this->day_of_week + 1) % 7) {
            return false;
        }
        $startTime = Time::parseTime($this->start_time);
        $endTime = Time::parseTime($this->end_time);
        if ($currentDayOfWeek === $this->day_of_week) {
            if (Time::isBefore($currentTime, $startTime)) {
                return false;
            }
            if (Time::isBefore($startTime, $endTime) && Time::isBefore($endTime, $currentTime)) {
                return false;
            }
        } else { // current time is next day
            if (Time::isBefore($startTime, $endTime)) {
                return false;
            }
            if (Time::isBefore($endTime, $currentTime)) {
                return false;
            }
        }
        return true;
    }
}
