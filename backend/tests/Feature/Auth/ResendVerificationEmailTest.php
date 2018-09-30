<?php

namespace Tests\Feature\Auth;

use App\Notifications\VerifyEmail;
use Carbon\Carbon;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Redis;
use Tests\ApiTestCase;

class ResendVerificationEmailTest extends ApiTestCase
{
    /**
     * Test resending verification email
     *
     * @return void
     */
    public function testResendVerificationEmail()
    {
        Notification::fake();
        $this->assertFailed(null, 401);
        $user = $this->userFactory()->create();
        $this->login($user);
        $decayMinutes = $this->guardConfig()['email']['decay_minutes'];
        $this->assertThrottle($this->assertSucceed(null), 1, 0, $decayMinutes * 60);
        $keys = Redis::keys($this->guardConfig()['verify_email']['storage_key'] . ':' .
            $user->getAuthIdentifier() . ':*');
        $this->assertFalse(empty($keys));
        $token = substr(strrchr($keys[0], ':'), 1);
        Notification::assertSentTo(
            $user,
            VerifyEmail::class,
            function ($notification) use ($token) {
                return $notification->token == $token;
            }
        );
        $this->assertThrottle($this->assertFailed(null, 429), 1, 0, $decayMinutes *60);
        $user->email_verified_at = Carbon::now()->getTimestamp();
        $user->save();
        $this->assertFailed(null, 403);
    }

    protected function method()
    {
        return 'POST';
    }

    protected function uri()
    {
        return '/auth/resend-verification-email';
    }

    protected function summary()
    {
        return 'Resend verification email';
    }

    protected function tag()
    {
        return 'authentication';
    }

    protected function rules()
    {
        return [];
    }
}
