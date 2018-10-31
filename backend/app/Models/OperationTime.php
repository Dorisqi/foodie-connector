<?php

namespace App\Models;

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
        'id',
    ];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }
}
