<?php

namespace App\Http\Controllers\Auth;

use App\Brokers\ResetPasswordBroker;
use App\Exceptions\ApiException;
use App\Facades\ApiThrottle;
use App\Http\Controllers\ApiController;
use App\Models\ApiUser;
use Illuminate\Cache\RateLimiter;
use Illuminate\Foundation\Auth\SendsPasswordResetEmails;
use Illuminate\Http\Request;

class ForgotPasswordController extends ApiController
{
    /*
    |--------------------------------------------------------------------------
    | Password Reset Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling password reset emails and
    | includes a trait which assists in sending these notifications from
    | your application to your users. Feel free to explore this trait.
    |
    */

    use SendsPasswordResetEmails;

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
     * Send a reset link to the given user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \App\Exceptions\ApiException
     */
    public function sendResetLinkEmail(Request $request)
    {
        $this->validateInput($request);

        $user = ApiUser::where('email', $request->input('email'))->first();
        if (is_null($user)) {
            throw ApiException::userNotFound();
        }
        if (!$user->is_email_verified) {
            throw ApiException::emailNotVerified();
        }

        $throttleKey = $user->emailThrottleKey();
        if ($this->limiter()->tooManyAttempts($throttleKey, 1)) {
            throw ApiException::tooManyAttempts(1, $this->limiter()->availableIn($throttleKey));
        }

        // We will send the password reset link to this user. Once we have attempted
        // to send the link, we will examine the response then see the message we
        // need to show to the user. Finally, we'll send out a proper response.
        ResetPasswordBroker::sendResetEmail($user);
        $this->limiter()->hit($throttleKey, $this->guardConfig()['email']['decay_minutes']);

        $response = $this->response();
        $response->headers->add(
            ApiThrottle::throttleHeaders(1, 0, $this->guardConfig()['email']['decay_minutes'])
        );
        return $response;
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
        ];
    }
}
