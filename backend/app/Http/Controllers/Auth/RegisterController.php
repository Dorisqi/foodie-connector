<?php

namespace App\Http\Controllers\Auth;

use App\Brokers\VerifyEmailBroker;
use Illuminate\Support\Facades\Auth;
use App\Exceptions\ApiException;
use App\Models\ApiUser;
use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class RegisterController extends ApiController
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
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
     * Handle a registration request for the application.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \App\Exceptions\ApiException
     * @throws \Exception
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), $this::rules());
        if ($validator->fails()) {
            if (isset($validator->failed()['email']['Unique'])) {
                throw ApiException::emailExists();
            }
            throw ApiException::validationFailed($validator);
        }

        $data = $request->all();
        $user = ApiUser::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        VerifyEmailBroker::sendVerificationEmail($user);
        $this->limiter()->hit($user->emailThrottleKey(), config('auth.guards.api.email.decay_minutes'));

        $this->guard()->loginUsingId($user->getAuthIdentifier());

        return $this->response([
            'api_token' => Auth::guard('api')->token(),
            'user' => Auth::guard('api')->user(),
        ]);
    }

    /**
     * Get the validation rules
     *
     * @return array
     */
    public static function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:api_users',
            'password' => 'required|password',
        ];
    }
}
