<?php

namespace App\Http\Controllers;

use App\Exceptions\ApiException;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Http\Request;
use Pusher\Pusher;
use Pusher\PusherException;

class PusherController extends ApiController
{
    /**
     * Authenticate pusher private channel
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \App\Exceptions\ApiException
     * @throws \Pusher\PusherException
     */
    public function auth(Request $request)
    {
        $this->validateInput($request);

        $userId = $this->user()->id;
        if (new PrivateChannel("user.${userId}") != $request->input('channel_name')) {
            throw ApiException::pusherAccessDenied();
        }

        $pusherConfig = config('broadcasting.connections.pusher');
        $pusher = new Pusher($pusherConfig['key'], $pusherConfig['secret'], $pusherConfig['app_id']);
        try {
            $response = $pusher->socket_auth($request->input('channel_name'), $request->input('socket_id'));
        } catch (PusherException $exception) {
            throw ApiException::pusherAccessDenied();
        }
        return $this->response($response);
    }

    public static function rules()
    {
        return [
            'socket_id' => 'required|string',
            'channel_name' => 'required|string',
        ];
    }
}
