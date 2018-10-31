<?php

namespace Tests\Unit;

use App\Facades\Time;
use Tests\TestCase;

class TimeFacadeTest extends TestCase
{
    /**
     * Test parsing time
     *
     * @return void
     */
    public function testParseTime()
    {
        $this->assertArraySubset(
            [14, 15],
            Time::parseTime("14:15")
        );
    }

    /**
     * Test is before
     *
     * @return void
     */
    public function testIsBefore()
    {
        $this->assertTrue(Time::isBefore([11, 20], [11, 21]));
        $this->assertTrue(Time::isBefore([10, 20], [11, 0]));
        $this->assertFalse(Time::isBefore([1, 5], [1, 5]));
        $this->assertFalse(Time::isBefore([2, 5], [2, 0]));
        $this->assertFalse(Time::isBefore([2, 5], [1, 10]));
    }
}
