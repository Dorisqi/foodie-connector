<?php

namespace App\Http\Controllers\Auth;

use App\Brokers\ResetPasswordBroker;
use App\Exceptions\ApiException;
use App\Http\Controllers\ApiController;
use App\Models\ApiUser;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Cache\RateLimiter;
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
     * Throttle rate limit
     */
    protected const RATE_LIMIT = 5;

    /**
     * Throttle decay minutes
     */
    protected const DECAY_MINUTES = 10;

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

        $user = ApiUser::where('email', $request->input('email'))->first();
        if (is_null($user)) {
            throw ApiException::userNotFound();
        }

        $throttleKey = $user->resetPasswordThrottleKey();
        if ($this->limiter()->tooManyAttempts($throttleKey, $this::RATE_LIMIT)) {
            throw ApiException::tooManyAttempts($this::RATE_LIMIT, $this->limiter()->availableIn($throttleKey));
        }

        // Here we will attempt to reset the user's password. If it is successful we
        // will update the password on an actual user model and persist it to the
        // database. Otherwise we will parse the error and return the response.
        ResetPasswordBroker::reset(
            $user,
            $request->input('token'),
            function () use ($throttleKey) {
                $this->limiter()->hit($throttleKey, $this::DECAY_MINUTES);
                throw ApiException::invalidResetPasswordToken(
                    $this::RATE_LIMIT,
                    $this->limiter()->retriesLeft($throttleKey, $this::RATE_LIMIT),
                    $this->limiter()->availableIn($throttleKey)
                );
            },
            function (ApiUser $user) use ($request) {
                $user->password = Hash::make($request->input('password'));
                $user->save();
                event(new PasswordReset($user));
                $this->guard()->login($user);
            }
        );

        return $this->response([
            'api_token' => $this->guard()->token(),
            'user' => $this->user()->toArray(true),
        ]);
    }

    /**
     * Get the rate limiter
     *
     * @return \Illuminate\Cache\RateLimiter
     */
    protected function limiter()
    {
        return app(RateLimiter::class);
    }

    /**
     * Get the password reset validation rules.
     *
     * @return array
     */
    public static function rules()
    {
        return [
            'token' => 'required|integer|digits:8',
            'email' => 'required|string|email',
            'password' => 'required|password',
        ];
    }
}
