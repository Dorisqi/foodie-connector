<?php

namespace Tests\Feature\Order;

use App\Models\Order;
use Tests\ApiTestCase;
use Tests\UriWithId;

class OrderQrCodeTest extends ApiTestCase
{
    use UriWithId;

    protected const PREFIX = '';

    protected $documented = false;

    /**
     * Test QR Code
     *
     * @return void
     *
     * @throws \ReflectionException
     */
    public function testQrCode()
    {
        $this->login();
        $this->id = 'A00000';
        $this->assertFailed(null, 404);
        $this->mockCurrentTime('2018-10-27 15:00:01');
        $order = factory(Order::class)->create();
        $this->id = $order->id;
        for ($i = 0; $i < 29; $i++) {
            $this->assertSucceed(null);
        }
        $this->assertFailed(null, 429);
    }

    public function method()
    {
        return 'GET';
    }

    public function uri()
    {
        return '/orders/qr-code/{id}';
    }
}
