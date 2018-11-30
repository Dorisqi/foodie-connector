<?php

namespace App\Http\Controllers;

use App\Exceptions\ApiException;
use App\Models\Order;
use Illuminate\Http\Request;
use Pusher\Pusher;
use Pusher\PusherException;

class PusherController extends ApiController
{
    /**
     * Authenticate pusher private channel
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     *
     * @throws \App\Exceptions\ApiException
     * @throws \Pusher\PusherException
     */
    public function auth(Request $request)
    {
        $this->validateInput($request);

        $channelName = $request->input('channel_name');
        if (preg_match('/^private-user.(\d+)$/', $channelName, $matches)) {
            if ((int)$matches[1] !== $this->user()->id) {
                throw ApiException::pusherAccessDenied();
            }
        } elseif (preg_match('/^private-order.([A-Z0-9]+)$/', $channelName, $matches)) {
            if (Order::query()->doesntExist()) {
                throw ApiException::pusherAccessDenied();
            }
        } else {
            throw ApiException::pusherAccessDenied();
        }

        $pusherConfig = config('broadcasting.connections.pusher');
        $pusher = new Pusher($pusherConfig['key'], $pusherConfig['secret'], $pusherConfig['app_id']);
        try {
            $response = $pusher->socket_auth($request->input('channel_name'), $request->input('socket_id'));
        } catch (PusherException $exception) {
            throw ApiException::pusherAccessDenied();
        }
        return response($response);
    }

    public static function rules()
    {
        return [
            'socket_id' => 'required|string',
            'channel_name' => 'required|string',
        ];
    }
}
