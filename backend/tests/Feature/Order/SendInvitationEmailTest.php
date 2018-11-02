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

class SendInvitationEmailTest extends ApiTestCase
{
    use UriWithId;

    /**
     * Test sending invitation email
     *
     * @return void
     *
     * @throws \ReflectionException
     */
    public function testSendInvitationEmail()
    {
        Notification::fake();
        $this->assertFailed(null, 401);
        $this->login();
        $this->id = 'A00000';
        $this->assertFailed(null, 422);
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
        $this->mockCurrentTime(Time::currentTime()->addHours(3)->toDateTimeString());
        $this->assertFailed([
            'email' => $receiverEmail,
        ], 422);
        $this->login(
            factory(ApiUser::class)->create([
                'email' => 'another@foodie-connector.delivery',
            ])
        );
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
        return '/orders/{id}/invitation-email';
    }

    protected function summary()
    {
        return 'Send invitation email';
    }

    protected function tag()
    {
        return 'order';
    }

    protected function rules()
    {
        return OrderController::sendInvitationEmailRules();
    }
}
