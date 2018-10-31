<?php

namespace Tests\Feature\Address;

use App\Models\Address;
use App\Models\ApiUser;
use Tests\ApiTestCase;
use Tests\UriWithId;

class DeleteAddressTest extends ApiTestCase
{
    use UriWithId;

    /**
     * Test deleting address
     *
     * @return void
     */
    public function testDeleteAddress()
    {
        $this->assertFailed(null, 401);
        $user = $this->userFactory()->create();
        $this->login($user);
        $address = factory(Address::class)->create();
        $this->id = $address->id;
        $this->assertSucceed(null);
        $this->assertTrue(is_null(Address::find($address->id)));
        $this->assertTrue(is_null(ApiUser::find($user->id)->defaultAddress));
        $this->id = 0;
        $this->assertFailed(null, 404);
    }

    protected function method()
    {
        return 'DELETE';
    }

    protected function uri()
    {
        return '/addresses/{id}';
    }

    protected function summary()
    {
        return 'Delete an existed address';
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
