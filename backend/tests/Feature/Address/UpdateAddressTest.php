<?php

namespace Tests\Feature\Address;

use App\Http\Controllers\AddressController;
use App\Models\Address;
use App\Models\ApiUser;
use Tests\ApiTestCase;

class UpdateAddressTest extends ApiTestCase
{
    /**
     * Current address id
     *
     * @param int
     */
    protected $id = null;

    /**
     * Test updating address
     *
     * @return void
     */
    public function testUpdateAddress()
    {
        $user = factory(ApiUser::class)->create();
        $address = factory(Address::class)->create([
            'api_user_id' => $user->id,
        ]);
        $this->id = $address->id;
        $addressArray = $address->toArray();
        $addressArray['name'] = 'Changed Name';
        $addressArray['is_default'] = true;
        unset($addressArray['api_user_id']);
        $this->assertFailed([
            'name' => $addressArray['name'],
        ], 401);
        $this->login($user);
        $this->assertSucceed([
            'name' => $addressArray['name'],
            'is_default' => true,
        ])
            ->assertJson($addressArray);
        $this->assertTrue(ApiUser::find($user->id)['default_address'] == $address->id);
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

    protected function uriParams()
    {
        return [
            'id' => $this->id,
        ];
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
