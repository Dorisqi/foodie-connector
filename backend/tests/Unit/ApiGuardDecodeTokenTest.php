<?php

namespace Tests\Unit;

use App\Models\ApiUser;
use App\Services\Auth\ApiGuard;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redis;
use Tests\TestCase;

class ApiGuardDecodeTokenTest extends TestCase
{
    /**
     * Test decoding token
     *
     * @return void
     *
     * @throws \ReflectionException
     */
    public function testDecodeToken()
    {
        $userId = 10;
        $token = bin2hex(openssl_random_pseudo_bytes(32));
        Redis::set('api_token:10:' . $token, true);
        $method = new \ReflectionMethod('\App\Services\Auth\ApiGuard', 'decodeToken');
        $method->setAccessible(true);
        $this->assertTrue(is_null($method->invoke(null, null)));
        $this->assertTrue(is_null($method->invoke(null, 'not_base64')));
        $encoded = base64_encode('short');
        $this->assertTrue(is_null($method->invoke(null, $encoded)));
        $encoded = base64_encode($token);
        $this->assertTrue(is_null($method->invoke(null, $encoded)));
        $encoded = base64_encode($token . $userId);
        $decoded = $method->invoke(null, $encoded);
        $this->assertTrue($decoded['token'] === $token);
        $this->assertTrue($decoded['id'] == $userId);
    }
}
