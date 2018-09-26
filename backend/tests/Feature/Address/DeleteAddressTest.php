<?php

namespace Tests\Feature\Address;

use App\Models\Address;
use App\Models\ApiUser;
use Tests\ApiTestCase;

class DeleteAddressTest extends ApiTestCase
{
    /**
     * Address id
     *
     * @var int
     */
    protected $id = null;

    /**
     * Test deleting address
     *
     * @return void
     */
    public function testDeleteAddress()
    {
        $user = factory(ApiUser::class)->create();
        $address = factory(Address::class)->create([
            'api_user_id' => $user->id,
        ]);
        $this->id = $address->id;
        $user['default_address'] = $address->id;
        $user->update();
        $this->assertFailed(null, 401);
        $this->login($user);
        $this->assertSucceed(null);
        $this->assertTrue(is_null(Address::find($address->id)));
        $this->assertTrue(is_null(ApiUser::find($user->id)['default_address']));
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

    protected function uriParams()
    {
        return [
            'id' => $this->id,
        ];
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
