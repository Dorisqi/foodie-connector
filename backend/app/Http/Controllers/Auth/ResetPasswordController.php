<?php

namespace App\Http\Controllers\Auth;

use App\Brokers\ResetPasswordBroker;
use App\Http\Controllers\ApiController;
use Illuminate\Foundation\Auth\ResetsPasswords;
use Illuminate\Http\Request;

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

    use ResetsPasswords;

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
            function ($user, $password) {
                $this->resetPassword($user, $password);
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
