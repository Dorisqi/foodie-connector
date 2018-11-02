<?php

namespace Tests\Unit;

use App\Facades\GeoLocation;
use Tests\TestCase;

class GeoLocationFacadeTest extends TestCase
{
    /**
     * Test distance
     *
     * @return void
     */
    public function testDistance()
    {
        $this->assertEquals(round(GeoLocation::distance(
            ['lat' => '10.0', 'lng' => '10.0'],
            ['lat' => '10.0', 'lng' => '10.0']
        ), 1), 0.0);
        $this->assertEquals(round(GeoLocation::distance(
            ['lat' => '40.42', 'lng' => '-86.91'],
            ['lat' => '40.12', 'lng' => '-86.50']
        ), 2), 48.19);
    }
}
