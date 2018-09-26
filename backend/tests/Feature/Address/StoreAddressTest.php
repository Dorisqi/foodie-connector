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
        $user = factory(ApiUser::class)->create();
        $address = factory(Address::class)->make([
            'api_user_id' => $user->id,
            'is_default' => false,
        ]);
        $this->assertFailed($address->toArray(), 401);
        $this->login($user);
        $response = $this->assertSucceed($address->toArray());
        $alteredAddress = $address->toArray();
        $alteredAddress['is_default'] = true;
        $response->assertJson($alteredAddress);
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

    protected function controller()
    {
        return AddressController::class;
    }
}
