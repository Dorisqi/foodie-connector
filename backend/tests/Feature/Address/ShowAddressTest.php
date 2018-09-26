<?php

namespace Tests\Feature\Address;

use App\Models\Address;
use App\Models\ApiUser;
use Tests\ApiTestCase;

class ShowAddressTest extends ApiTestCase
{
    /**
     * Address id
     */
    protected $id = null;

    /**
     * Test showing address
     *
     * @return void
     */
    public function testShowAddress()
    {
        $user = factory(ApiUser::class)->create();
        $address = factory(Address::class)->create([
            'api_user_id' => $user,
        ]);
        $this->id = $address->id;
        $this->assertFailed([], 401);
        $this->login($user);
        $addressArray = $address->toArray();
        $addressArray['is_default'] = false;
        $this->assertSucceed([])->assertJson($addressArray);
        $this->id = 0;
        $this->assertFailed([], 404);
    }

    protected function method()
    {
        return 'GET';
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
        return 'Show detail of a specific address';
    }

    protected function tag()
    {
        return 'address';
    }

    protected function rules()
    {
        return [];
    }
}
