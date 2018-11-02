<?php

namespace Tests\Feature\Auth;

use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Notifications\ResetPassword;
use Carbon\Carbon;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Redis;
use Tests\ApiTestCase;

class ForgotPasswordTest extends ApiTestCase
{
    /**
     * Sending verification code test
     *
     * @return void
     */
    public function testSendingVerificationCode()
    {
        Notification::fake();
        $user = $this->userFactory()->create();
        // $this->assertFailed([
        //     'email' => $user->email,
        // ], 403);
        $user->email_verified_at = Carbon::now()->getTimestamp();
        $user->save();
        $decayMinutes = $this->guardConfig()['email']['decay_minutes'];
        $this->assertThrottle($this->assertSucceed([
            'email' => $user->email,
        ]), 1, 0, $decayMinutes * 60);
        $keys = Redis::keys('password_reset_token:' . $user->getAuthIdentifier() . ':*');
        $this->assertFalse(empty($keys));
        $token = substr(strrchr($keys[0], ':'), 1);
        Notification::assertSentTo(
            $user,
            ResetPassword::class,
            function ($notification, $channels) use ($token) {
                return $notification->token == $token;
            }
        );
        $this->assertThrottle($this->assertFailed([
            'email' => $user->email,
        ], 429), 1, 0, $decayMinutes * 60);
        $this->assertFailed([
            'email' => 'wrong@foodie-connector.delivery',
        ], 404);
        $this->assertFailed([
            'email' => 'not_email',
        ], 422);
    }

    protected function method()
    {
        return 'POST';
    }

    protected function uri()
    {
        return '/auth/reset-password-email';
    }

    protected function summary()
    {
        return 'Send email containing password reset link';
    }

    protected function tag()
    {
        return 'authentication';
    }

    protected function rules()
    {
        return ForgotPasswordController::rules();
    }
}
