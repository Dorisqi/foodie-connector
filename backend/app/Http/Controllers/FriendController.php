<?php

namespace App\Http\Controllers;

use App\Exceptions\ApiException;
use App\Models\ApiUser;
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
        return $this->response($this->user()->friends()->select('name', 'email', 'friends.friend_id')->get());
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

        if (!$request->has('friend_id')) {
            $friend_id = ApiUser::where('email', $request->input('email'))->first()->friend_id;
        } else {
            $friend_id = $request->input('friend_id');
        }
        if ($this->user()->friends()->where('friends.friend_id', $friend_id)->exists()) {
            throw ApiException::alreadyFriend();
        }

        $this->user()->friends()->attach($friend_id);

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
        $user = Auth::guard('api')->user();
        return [
            'friend_id' => [
                'string',
                'exists:api_users',
                Rule::notIn([$user->friend_id])
            ],
            'email' => [
                'required_without:friend_id',
                'email',
                'exists:api_users',
                Rule::notIn([$user->email]),
            ],
        ];
    }
}
