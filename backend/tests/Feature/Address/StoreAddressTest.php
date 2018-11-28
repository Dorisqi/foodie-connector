<?php

namespace Tests\Feature\Address;

use App\Http\Controllers\AddressController;
use App\Models\Address;
use App\Models\ApiUser;
use Tests\ApiTestCase;

class StoreAddressTest extends ApiTestCase
{
    /**
     * Test storing address
     *
     * @return void
     */
    public function testStoreAddress()
    {
        $this->assertFailed(null, 401, false);
        $this->login(factory(ApiUser::class)->create());
        $address = factory(Address::class)->make();
        $response = $this->assertSucceed($address->toArray());
        $alteredAddress = $address->toArray();
        $alteredAddress['is_default'] = true;
        unset($alteredAddress['geo_location']);
        $response->assertJson([$alteredAddress]);
        $alteredAddress['phone'] = 'invalid_phone';
        $this->assertFailed($alteredAddress, 422);
    }

    protected function method()
    {
        return 'POST';
    }

    protected function uri()
    {
        return '/addresses';
    }

    protected function summary()
    {
        return 'Add a new address';
    }

    protected function tag()
    {
        return 'address';
    }

    protected function rules()
    {
        return AddressController::storeRules();
    }
}
