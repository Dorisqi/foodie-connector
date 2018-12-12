<?php

namespace Tests\Feature\Order;

use App\Facades\Time;
use App\Http\Controllers\OrderController;
use App\Models\ApiUser;
use App\Models\Order;
use App\Notifications\OrderInvitation;
use Illuminate\Notifications\AnonymousNotifiable;
use Illuminate\Support\Facades\Notification;
use Tests\ApiTestCase;
use Tests\UriWithId;

class InviteTest extends ApiTestCase
{
    use UriWithId;

    /**
     * Test inviting friend
     *
     * @return void
     *
     * @throws \ReflectionException
     */
    public function testInvite()
    {
        Notification::fake();
        $this->assertFailed(null, 401, false);
        $this->login();
        $this->id = 'A00000';
        $receiver = new AnonymousNotifiable();
        $receiverEmail = 'receiver@foodie-connector.delivery';
        $receiver->route('mail', $receiverEmail);
        $this->assertFailed([
            'email' => $receiverEmail,
        ], 404);
        $order = factory(Order::class)->create();
        $this->id = $order->id;
        $this->assertSucceed([
            'email' => $receiverEmail,
        ]);
        Notification::assertSentTo(
            $receiver,
            OrderInvitation::class,
            function ($notification) use ($order) {
                return $notification->initiator === $this->user()->name
                    && $notification->orderLink === $order->share_link;
            }
        );
        $friend = $this->userFactory()->states('new', 'friend')->create();
        $this->assertSucceed([
            'friend_id' => $friend->friend_id,
        ]);
        Notification::assertSentTo(
            $receiver,
            OrderInvitation::class,
            function ($notification) use ($order) {
                return $notification->initiator === $this->user()->name
                    && $notification->orderLink === $order->share_link;
            }
        );
        $this->assertFailed([
            'friend_id' => 'NOTEXI',
        ], 422);
        $this->assertFailed(null, 422);
        $this->mockCurrentTime(Time::currentTime()->addHours(3)->toDateTimeString());
        $this->assertFailed([
            'email' => $receiverEmail,
        ], 422);
        $this->login($friend);
        $this->assertFailed([
            'email' => $receiverEmail,
        ], 404, false);
    }

    protected function method()
    {
        return 'POST';
    }

    protected function uri()
    {
        return '/orders/{id}/invitation';
    }

    protected function summary()
    {
        return 'Send invitations';
    }

    protected function tag()
    {
        return 'order';
    }

    protected function rules()
    {
        return OrderController::inviteRules();
    }
}
