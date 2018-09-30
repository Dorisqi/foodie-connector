<?php

namespace App\Http\Controllers;

use App\Exceptions\ApiException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class ProfileController extends ApiController
{
    /**
     * Show the profile
     *
     * @param \Illuminate\Http\Request
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request)
    {
        return $this->response($this->guard()->user());
    }

    /**
     * Update the profile
     *
     * @param \Illuminate\Http\Request
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \App\Exceptions\ApiException
     */
    public function update(Request $request)
    {
        $this->validateInput($request, $this::updateProfileRules());

        $user = $this->guard()->user();
        $user->fill($request->only([
            'name',
        ]));
        $user->save();

        return $this->response($user);
    }

    /**
     * Change the password
     *
     * @param \Illuminate\Http\Request
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \App\Exceptions\ApiException
     */
    public function changePassword(Request $request)
    {
        $this->validateInput($request, $this::changePasswordRules());

        $user = $this->guard()->user();
        if (!$this->guard()->getProvider()->validateCredentials($user, [
            'password' => $request->input('old_password'),
        ])) {
            throw ApiException::invalidOldPassword();
        }

        $user->password = Hash::make($request->input('new_password'));
        $user->save();

        return $this->response(null);
    }

    /**
     * Update the email address
     *
     * @param \Illuminate\Http\Request
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \App\Exceptions\ApiException
     */
    public function updateEmail(Request $request)
    {
        $validator = Validator::make($request->all(), $this::updateEmailRules());
        if ($validator->fails()) {
            if (isset($validator->failed()['email']['Unique'])) {
                throw ApiException::emailExists();
            }
            throw ApiException::validationFailed($validator);
        }

        $user = $this->guard()->user();
        $user->email = $request->input('email');
        $user->save();

        return $this->response($user);
    }

    /**
     * Get the rule for changing password
     *
     * @return array
     */
    public static function changePasswordRules()
    {
        return [
            'old_password' => 'required|string',
            'new_password' => 'required|password',
        ];
    }

    /**
     * Get the rule for updating profile
     *
     * @return array
     */
    public static function updateProfileRules()
    {
        return [
            'name' => 'string|max:255',
        ];
    }

    /**
     * Get the rule for updating email
     *
     * @return array
     */
    public static function updateEmailRules()
    {
        return [
            'email' => 'required|email|max:255|unique:api_users'
        ];
    }
}
