<?php

namespace Tests\Feature\Auth;

use App\Http\Controllers\Auth\RegisterController;
use App\Models\ApiUser;
use App\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Redis;
use Tests\ApiTestCase;

class RegisterTest extends ApiTestCase
{
    protected const EMAIL = 'user@foodie-connector.delivery';
    protected const PASSWORD = 'test123456';
    protected const NAME = 'Test User';

    /**
     * Register test
     *
     * @return void
     */
    public function testRegister()
    {
        Notification::fake();
        $user = $this->userFactory()->make();
        $this->assertSucceed([
            'email' => $user->email,
            'password' => ApiUser::testingPassword(),
            'name' => $user->name,
        ]);
        $this->assertAuthenticated('api');
        $user = $this->user();
        $keys = Redis::keys($this->guardConfig()['verify_email']['storage_key'] . ':' .
            $user->getAuthIdentifier() . ':*');
        $this->assertFalse(empty($keys));
        $token = base64_encode(substr(strrchr($keys[0], ':'), 1) . $user->getAuthIdentifier());
        Notification::assertSentTo(
            $user,
            VerifyEmail::class,
            function ($notification, $channels) use ($token) {
                return $notification->token == $token;
            }
        );
        $this->assertTrue($this->limiter()->tooManyAttempts($user->emailThrottleKey(), 1));
        $this->assertTrue($this->guard()->attempt([
            'email' => $user->email,
            'password' => ApiUser::testingPassword(),
        ]));
        $this->assertSucceed([
            'email' => 'exist@foodie-connector.delivery',
            'password' => ApiUser::testingPassword(),
            'name' => $user->name,
        ], false);
        $this->assertFailed([
            'email' => 'exist@foodie-connector.delivery',
            'password' => 'short',
            'name' => $user->name,
        ], 422);
    }

    protected function method()
    {
        return 'POST';
    }

    protected function uri()
    {
        return '/auth/register';
    }

    protected function summary()
    {
        return 'Register for a new user';
    }

    protected function tag()
    {
        return 'authentication';
    }

    protected function rules()
    {
        return RegisterController::rules();
    }
}
