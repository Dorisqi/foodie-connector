<?php

namespace Tests\Unit;

use App\Models\OperationTime;
use Carbon\Carbon;
use Tests\TestCase;

class OperationTimeTest extends TestCase
{
    /**
     * Test contains
     *
     * @return void
     */
    public function testContains()
    {
        $operationTime = new OperationTime([
            'day_of_week' => 3,
            'start_time' => '12:00:00',
            'end_time' => '13:00:00',
        ]);
        $this->assertFalse($operationTime->contains(Carbon::parse('2018-10-31 11:59:59')));
        $this->assertTrue($operationTime->contains(Carbon::parse('2018-10-31 12:00:00')));
        $this->assertFalse($operationTime->contains(Carbon::parse('2018-11-01 12:00:00')));
        $this->assertFalse($operationTime->contains(Carbon::parse('2018-10-31 13:00:01')));
        $operationTime = new OperationTime([
            'day_of_week' => 6,
            'start_time' => '12:00:00',
            'end_time' => '1:00:00',
        ]);
        $this->assertTrue($operationTime->contains(Carbon::parse('2018-10-27 12:30:00')));
        $this->assertTrue($operationTime->contains(Carbon::parse('2018-10-28 00:10:00')));
        $this->assertFalse($operationTime->contains(Carbon::parse('2018-10-28 1:00:01')));
    }
}
