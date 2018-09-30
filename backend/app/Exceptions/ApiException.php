<?php

namespace App\Exceptions;

use App\Facades\ApiThrottle;
use Exception;
use Illuminate\Contracts\Validation\Validator;
use Throwable;

class ApiException extends Exception
{
    /*
     * Static functions to create new ApiExceptions
     *
     * @return ApiException
     */

    /* Validation */
    public static function validationFailed(Validator $validator)
    {
        return new ApiException('Validation failed.', 422, null, $validator->errors());
    }

    /* User and Authentication */
    public static function emailExists()
    {
        return new ApiException('The email has already been taken.', 409);
    }
    public static function loginFailed(int $rateLimit, int $retriesRemaining, int $retryAfter = null)
    {
        return new ApiException(
            'These credentials do not match our records.',
            401,
            ApiThrottle::throttleHeaders($rateLimit, $retriesRemaining, $retryAfter)
        );
    }
    public static function requireAuthentication()
    {
        return new ApiException('This page requires authentication.', 401);
    }
    public static function userNotFound()
    {
        return new ApiException('We can\'t find a user with that e-mail address.', 404);
    }
    public static function invalidToken(int $rateLimit, int $retriesRemaining, int $retryAfter = null)
    {
        return new ApiException(
            'The password reset token is invalid or expired.',
            401,
            ApiThrottle::throttleHeaders($rateLimit, $retriesRemaining, $retryAfter)
        );
    }
    public static function emailAlreadyVerified()
    {
        return new ApiException('The email address is already verified.', 403);
    }
    public static function emailNotVerified()
    {
        return new ApiException('The email address has not been verified', 403);
    }

    /* Throttle */
    public static function tooManyAttempts(int $rateLimit, int $retryAfter)
    {
        return new ApiException(
            'Too many attempts',
            429,
            ApiThrottle::throttleHeaders($rateLimit, 0, $retryAfter)
        );
    }

    /* Resource */
    public static function resourceNotFound()
    {
        return new ApiException('Resource not found.', 404);
    }

    /* Profile */
    public static function invalidOldPassword()
    {
        return new ApiException('The old password does not match our records.', 401);
    }


    /**
     * Headers
     *
     * @var array
     */
    protected $headers = null;

    /**
     * Data
     *
     * @mixed array
     */
    protected $data = null;

    /**
     * Construct the exception
     *
     * @param string $message [optional] The Exception message to throw.
     * @param int $code [optional] The Exception code.
     * @param array $headers [optional] Headers.
     * @param mixed $data [optional] Data
     * @param Throwable $previous [optional] The previous throwable used for the exception chaining.
     */
    public function __construct(
        string $message = "Internal Server Error",
        int $code = 500,
        array $headers = null,
        $data = null,
        Throwable $previous = null
    ) {
        parent::__construct($message, $code, $previous);
        $this->headers = $headers;
        $this->data = $data;
    }

    /**
     * Create response for API errors
     *
     * @params
     * @return \Illuminate\Http\Response
     */
    public function response()
    {
        $data = [
            'message' => $this->getMessage(),
        ];
        if (!is_null($this->data)) {
            $data['data'] = $this->data;
        }
        $response = response()->json($data, $this->getCode());
        if (!is_null($this->headers)) {
            $response->headers->add($this->headers);
        }
        return $response;
    }
}
