<?php

namespace App\Http\Controllers\Auth;

use App\Exceptions\ApiException;
use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Str;

class LoginController extends ApiController
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Decay minutes for throttle
     */
    protected const DECAY_MINUTES = 10;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    /**
     * Handle a login request to the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \App\Exceptions\ApiException
     */
    public function login(Request $request)
    {
        $this->validateInput($request);

        // If the class is using the ThrottlesLogins trait, we can automatically throttle
        // the login attempts for this application. We'll key this by the username and
        // the IP address of the client making these requests into this application.
        if ($this->hasTooManyLoginAttempts($request)) {
            $this->fireLockoutEvent($request);

            throw ApiException::tooManyAttempts(
                App::environment('testing')
                    ? 60
                    : $this->limiter()->availableIn($this->throttleKey($request)),
                $this->maxAttempts()
            );
        }

        if ($this->attemptLogin($request)) {
            return $this->response([
                'api_token' => $this->guard()->token(),
                'user' => $this->guard()->user(),
            ]);
        }

        // If the login attempt was unsuccessful we will increment the number of attempts
        // to login and redirect the user back to the login form. Of course, when this
        // user surpasses their maximum number of attempts they will get locked out.
        $this->incrementLoginAttempts($request);

        throw ApiException::loginFailed(
            $this->maxAttempts(),
            $this->limiter()->retriesLeft($this->throttleKey($request), $this->maxAttempts())
        );
    }

    /**
     * Get the guard to be used during authentication.
     *
     * @return \App\Services\Auth\ApiGuard
     */
    protected function guard()
    {
        return parent::guard();
    }

    /**
     * Get the decay minutes
     *
     * @return int
     */
    public function decayMinutes()
    {
        return $this::DECAY_MINUTES;
    }

    /**
     * Get throttle key
     *
     * @param \Illuminate\Http\Request
     * @return string
     */
    protected function throttleKey(Request $request)
    {
        return 'login|' . Str::lower($request->input($this->username()));
    }

    /**
     * Get the validation rules
     *
     * @return array
     */
    public static function rules()
    {
        return [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ];
    }
}
