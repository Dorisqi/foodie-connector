<?php

namespace App\Http\Controllers;

use App\Exceptions\ApiException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

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
}
