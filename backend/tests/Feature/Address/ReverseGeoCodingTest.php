<?php

namespace Tests\Feature\Address;

use App\Http\Controllers\AddressController;
use Tests\ApiTestCase;

class ReverseGeoCodingTest extends ApiTestCase
{
    /**
     * Test reverse GeoCoding
     *
     * @return void
     */
    public function testReverseGeoCoding()
    {
        $this->assertFailed(null, 401);
        $this->login();
        $this->assertSucceed([
            'lat' => '40.4225562',
            'lng' => '-86.9088601',
        ]);
    }

    protected function method()
    {
        return 'GET';
    }

    protected function uri()
    {
        return '/geo-coding/coords';
    }

    protected function summary()
    {
        return 'Reverse GeoCoding by coordinates';
    }

    protected function tag()
    {
        return 'address';
    }

    protected function rules()
    {
        return AddressController::reverseGeoCodingRules();
    }
}
