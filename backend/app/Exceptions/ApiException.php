<?php

namespace App\Exceptions;

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
        return new ApiException('Validation failed.', 422, $validator->errors());
    }

    /* User and Authentication */
    public static function emailExists()
    {
        return new ApiException('The email has already been taken.', 409);
    }
    public static function loginFailed()
    {
        return new ApiException('These credentials do not match our records.', 401);
    }
    public static function requireAuthentication()
    {
        return new ApiException('This page requires authentication.', 401);
    }
    public static function userNotFound()
    {
        return new ApiException('We can\'t find a user with that e-mail address.', 404);
    }
    public static function invalidToken()
    {
        return new ApiException('The password reset token is invalid or expired', 401);
    }

    /* Throttle */
    public static function tooManyAttempts(int $seconds)
    {
        return new ApiException('Too many attempts', 429, [
            'available_seconds' => $seconds,
        ]);
    }


    /**
     * Extra Exception information
     *
     * @var mixed
     */
    private $errorInformation = null;

    /**
     * Construct the exception
     *
     * @param string $message [optional] The Exception message to throw.
     * @param int $code [optional] The Exception code.
     * @param mixed $errorInformation [optional] Extra Exception information.
     * @param Throwable $previous [optional] The previous throwable used for the exception chaining.
     */
    public function __construct(
        string $message = "Internal Server Error",
        int $code = 500,
        $errorInformation = null,
        Throwable $previous = null
    ) {
        parent::__construct($message, $code, $previous);
        $this->errorInformation = $errorInformation;
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
        if (!is_null($this->errorInformation)) {
            $data['information'] = $this->errorInformation;
        }
        return response()
            ->json($data, $this->getCode());
    }
}
