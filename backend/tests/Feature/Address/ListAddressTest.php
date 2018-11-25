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
        $this->assertFailed(null, 401, false);
        $this->login($this->userFactory()->create());
        factory(Address::class, 3)->create();
        $this->login($this->userFactory()->state('new')->create());
        factory(Address::class, 2)->create();
        $response = $this->assertSucceed(null);
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
