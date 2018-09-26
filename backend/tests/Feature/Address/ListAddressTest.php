<?php

namespace Tests\Feature\Address;

use App\Models\Address;
use App\Models\ApiUser;
use Tests\ApiTestCase;

class ListAddressTest extends ApiTestCase
{
    /**
     * Test listing address
     *
     * @return void
     */
    public function testListAddress()
    {
        $user = factory(ApiUser::class)->create();
        factory(Address::class, 2)
            ->create()
            ->each(function ($address) use ($user) {
                $address['api_user_id'] = $user->id;
                $address->save();
            });
        factory(Address::class, 3)->create();
        $this->assertFailed([], 401);
        $this->login($user);
        $response = $this->assertSucceed([]);
        $response->assertJsonCount(2);
    }

    protected function method()
    {
        return 'GET';
    }

    protected function uri()
    {
        return '/addresses';
    }

    protected function summary()
    {
        return 'Get a list of all addresses';
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
