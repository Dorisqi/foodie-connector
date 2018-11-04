<?php

namespace Tests\Feature\Profile;

use App\Http\Controllers\ProfileController;
use App\Models\ApiUser;
use App\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Redis;
use Tests\ApiTestCase;

class UpdateEmailTest extends ApiTestCase
{
    /**
     * Test updating email
     *
     * @return void
     */
    public function testUpdateEmail()
    {
        Notification::fake();
        $this->assertFailed(null, 401);
        $user = $this->userFactory()->create();
        $this->login($user);
        $this->assertSucceed([
            'email' => 'new@foodie-connector.delivery',
        ]);
        $user = ApiUser::find($user->id);
        $this->assertTrue($user->email === 'new@foodie-connector.delivery');
        $this->assertFalse($user->is_email_verified);
        $keys = Redis::keys($this->guardConfig()['verify_email']['storage_key'] . ':' .
            $user->getAuthIdentifier() . ':*');
        $this->assertFalse(empty($keys));
        $token = base64_encode(substr(strrchr($keys[0], ':'), 1) . $user->getAuthIdentifier());
        Notification::assertSentTo(
            $user,
            VerifyEmail::class,
            function ($notification) use ($token) {
                return $notification->token == $token;
            }
        );
        $this->userFactory()->create([
            'email' => 'exist@foodie-connector.delivery',
        ]);
        $this->assertFailed([
            'email' => 'exist@foodie-connector.delivery',
        ], 422);
        $this->assertFailed([
            'email' => 'not_email',
        ], 422);
    }

    public function method()
    {
        return 'PUT';
    }

    public function uri()
    {
        return '/profile/email';
    }

    public function summary()
    {
        return 'Update the email address';
    }

    public function tag()
    {
        return 'profile';
    }

    public function rules()
    {
        return ProfileController::updateEmailRules();
    }
}
