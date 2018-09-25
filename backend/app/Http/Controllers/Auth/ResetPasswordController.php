<?php

namespace App\Http\Controllers\Auth;

use App\Brokers\ResetPasswordBroker;
use App\Http\Controllers\ApiController;
use App\Models\ApiUser;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ResetPasswordController extends ApiController
{
    /*
    |--------------------------------------------------------------------------
    | Password Reset Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling password reset requests
    | and uses a simple trait to include this behavior. You're free to
    | explore this trait and override any methods you wish to tweak.
    |
    */

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    /**
     * Reset the given user's password.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \App\Exceptions\ApiException
     */
    public function reset(Request $request)
    {
        $this->validateInput($request);

        // Here we will attempt to reset the user's password. If it is successful we
        // will update the password on an actual user model and persist it to the
        // database. Otherwise we will parse the error and return the response.
        ResetPasswordBroker::reset(
            $request->only(['email', 'password', 'token']),
            function (ApiUser $user, string $password) {
                $user->password = Hash::make($password);
                $user->save();
                event(new PasswordReset($user));
                Auth::guard('api')->login($user);
            }
        );

        return $this->response();
    }

    /**
     * Get the password reset validation rules.
     *
     * @return array
     */
    protected function rules()
    {
        return [
            'token' => 'required|numeric|min:0|max:99999999',
            'email' => 'required|email',
            'password' => 'required|min:6',
        ];
    }
}
