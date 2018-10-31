<?php

namespace App\Models;

use Carbon\Carbon;
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
     * @param \Carbon\Carbon $time
     * @return bool
     */
    public function contains(Carbon $time)
    {
        if ($time->dayOfWeek !== $this->day_of_week && $time->dayOfWeek !== ($this->day_of_week + 1) % 7) {
            return false;
        }
        $timeOnly = Carbon::createFromTime($time->hour, $time->minute, $time->second);
        $startTime = Carbon::parse($this->start_time);
        $endTime = Carbon::parse($this->end_time);
        if ($time->dayOfWeek === $this->day_of_week) {
            if ($timeOnly->lessThan($startTime)) {
                return false;
            }
            if ($startTime->lessThan($endTime) && $endTime->lessThan($timeOnly)) {
                return false;
            }
        } else { // current time is next day
            if ($startTime->lessThan($endTime)) {
                return false;
            }
            if ($endTime->lessThan($timeOnly)) {
                return false;
            }
        }
        return true;
    }
}
