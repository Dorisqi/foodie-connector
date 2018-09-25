<?php

namespace Tests\Feature\Auth;

use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Models\ApiUser;
use App\Notifications\ResetPassword;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;
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
        $user = factory(ApiUser::class)->create();
        $this->assertSucceed([
            'email' => $user->email,
        ]);
        Notification::assertSentTo(
            $user,
            ResetPassword::class,
            function ($notification, $channels) use ($user) {
                return !is_null($notification->token);
            }
        );
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

    protected function controller()
    {
        return ForgotPasswordController::class;
    }
}
