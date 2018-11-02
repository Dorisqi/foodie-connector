<?php

namespace Tests\Feature\Auth;

use App\Brokers\VerifyEmailBroker;
use App\Http\Controllers\Auth\VerificationController;
use App\Models\ApiUser;
use Illuminate\Support\Facades\Redis;
use Tests\ApiTestCase;

class VerifyEmailTest extends ApiTestCase
{
    /**
     * Test verifying email
     *
     * @return void
     */
    public function testVerifyEmail()
    {
        $user = $this->userFactory()->create();
        $decodedToken = '221bbbc7fc522a1e759302d858a76c5c928245c08b65809286fdf0a75326ada8';
        $token = base64_encode($decodedToken . $user->getAuthIdentifier());
        Redis::set(VerifyEmailBroker::redisKey($user->id, $decodedToken), true);
        $this->assertSucceed([
            'token' => $token,
        ]);
        $user = ApiUser::find($user->id);
        $this->assertTrue($user->is_email_verified);
        $this->assertTrue(is_null(Redis::get(VerifyEmailBroker::redisKey($user->id, $decodedToken))));
        $this->assertFailed([
            'token' => 'invalid_token',
        ], 401);
        $this->assertFailed([], 422);
    }

    protected function method()
    {
        return 'POST';
    }

    protected function uri()
    {
        return '/auth/verify-email';
    }

    protected function summary()
    {
        return 'Verify the email';
    }

    protected function tag()
    {
        return 'authentication';
    }

    protected function rules()
    {
        return VerificationController::rules();
    }
}
