<?php

namespace Tests\Feature\Restaurant;

use Tests\ApiTestCase;

class ShowRestaurantTest extends ApiTestCase
{
    protected $id = 1;

    /**
     * Test showing restaurant
     *
     * @return void
     */
    public function testShowRestaurant()
    {
        $this->seedRestaurantData();
        $this->assertFailed(null, 401);
        $this->login();
        $this->assertSucceed(null);
        $this->id = 0;
        $this->assertFailed(null, 404);
    }

    public function method()
    {
        return 'GET';
    }

    protected function uri()
    {
        return '/restaurants/{id}';
    }

    protected function uriParams()
    {
        return [
            'id' => $this->id,
        ];
    }

    protected function summary()
    {
        return 'Get the detail of a specific restaurant';
    }

    protected function tag()
    {
        return 'restaurant';
    }

    protected function rules()
    {
        return [];
    }
}
