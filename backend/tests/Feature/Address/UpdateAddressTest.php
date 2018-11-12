<?php

namespace Tests\Feature\Address;

use App\Http\Controllers\AddressController;
use App\Models\Address;
use App\Models\ApiUser;
use Tests\ApiTestCase;
use Tests\UriWithId;

class UpdateAddressTest extends ApiTestCase
{
    use UriWithId;

    /**
     * Test updating address
     *
     * @return void
     */
    public function testUpdateAddress()
    {
        $this->assertFailed(null, 401);
        $this->login(factory(ApiUser::class)->create());
        $address = factory(Address::class)->create();
        $this->id = $address->id;
        $addressArray = $address->toArray();
        $addressArray['name'] = 'Changed Name';
        unset($addressArray['api_user_id']);
        $addressArray['place_id'] = 'ChIJPbVda67iEogRTWzmvivderE';
        $response = $this->assertSucceed([
            'name' => $addressArray['name'],
            'place_id' => $addressArray['place_id'],
            'is_default' => true,
        ]);
        $addressArray['line_1'] = '';
        $addressArray['zip_code'] = '47907';
        $addressArray['is_default'] = true;
        $addressArray['lat'] = '40.4248';
        $addressArray['lng'] = '-86.911';
        $response->assertJson([$addressArray]);
        $newAddress = factory(Address::class)->create();
        $this->id = $newAddress->id;
        $newAddressArray = $newAddress->toArray();
        $newAddressArray['is_default'] = true;
        $addressArray['is_default'] = false;
        $this->assertSucceed([
            'is_default' => true,
        ], false)
            ->assertJson([$addressArray, $newAddressArray]);
        $this->assertFailed([
            'phone' => 'invalid_phone',
        ], 422);
        $this->id = 0;
        $this->assertFailed([
            'name' => $addressArray['name'],
        ], 404);
    }

    protected function method()
    {
        return 'PUT';
    }

    protected function uri()
    {
        return '/addresses/{id}';
    }

    protected function summary()
    {
        return 'Updating an existed address';
    }

    protected function tag()
    {
        return 'address';
    }

    protected function rules()
    {
        return AddressController::rules();
    }
}
