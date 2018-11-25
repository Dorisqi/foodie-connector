<?php

namespace App\Http\Controllers;

use App\Exceptions\ApiException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class FriendController extends ApiController
{
    /**
     * List all friends
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        return $this->response($this->user()->friends()->get());
    }

    /**
     * Add a new friend
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \App\Exceptions\ApiException
     */
    public function store(Request $request)
    {
        $this->validateInput($request, $this::storeRules());

        if ($this->user()->friends()->where('friends.friend_id', $request->input('friend_id'))->exists()) {
            throw ApiException::validationFailedErrors([
                'friend_id' => [
                    'The user is already your friend.',
                ],
            ]);
        }

        $this->user()->friends()->attach($request->input('friend_id'));

        return $this->response($this->user()->friends()->get());
    }

    /**
     * Delete a friend
     *
     * @param string $friendId
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \App\Exceptions\ApiException
     */
    public function destroy($friendId)
    {
        if (!$this->user()->friends()->where('friends.friend_id', $friendId)->exists()) {
            throw ApiException::resourceNotFound();
        }
        $this->user()->friends()->detach($friendId);

        return $this->response($this->user()->friends()->get());
    }

    public static function storeRules()
    {
        return [
            'friend_id' => [
                'required',
                'string',
                'exists:api_users,friend_id',
                Rule::notIn([Auth::guard('api')->user()->friend_id])
            ],
        ];
    }
}
