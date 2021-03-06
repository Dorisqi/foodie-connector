<?php

namespace App\Http\Controllers\Auth;

use App\Brokers\VerifyEmailBroker;
use App\Exceptions\ApiException;
use App\Facades\ApiThrottle;
use App\Models\ApiUser;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\ApiController;

class VerificationController extends ApiController
{
    /*
    |--------------------------------------------------------------------------
    | Email Verification Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling email verification for any
    | user that recently registered with the application. Emails may also
    | be resent if the user did not receive the original email message.
    |
    */

    /**
     * Create a new controller instance
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api')->except('verify');
    }

    /**
     * Resend verification email
     *
     * @param \Illuminate\Http\Request
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \App\Exceptions\ApiException
     */
    public function resendEmail(Request $request)
    {
        $user = $this->user();
        if ($user->is_email_verified) {
            throw ApiException::emailAlreadyVerified();
        }
        $throttleKey = $user->emailThrottleKey();
        if ($this->limiter()->tooManyAttempts($throttleKey, 1)) {
            throw ApiException::tooManyAttempts(1, $this->limiter()->availableIn($throttleKey));
        }

        VerifyEmailBroker::sendVerificationEmail($this->limiter(), $user);

        $response = $this->response();
        $response->headers->add(
            ApiThrottle::throttleHeaders(1, 0, $this->guardConfig()['email']['decay_minutes'])
        );
        return $response;
    }

    /**
     * Verify email
     *
     * @param \Illuminate\Http\Request
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \App\Exceptions\ApiException
     */
    public function verify(Request $request)
    {
        $this->validateInput($request);

        VerifyEmailBroker::verify(
            $request->input('token'),
            function ($userId) {
                $user = ApiUser::find($userId);
                $user->email_verified_at = Carbon::now();
                $user->save();
            }
        );

        return $this->response();
    }

    /**
     * Get the rules for email verification
     *
     * @return array
     */
    public static function rules()
    {
        return [
            'token' => 'required|string|max:255'
        ];
    }
}
