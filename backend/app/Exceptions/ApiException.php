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
        return new ApiException('Validation failed.', 101, $validator->errors());
    }

    /* User and Authentication */
    public static function emailExists()
    {
        return new ApiException('The email has already been taken.', 201);
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
        string $message = "",
        int $code = 0,
        $errorInformation = null,
        Throwable $previous = null
    ) {
        parent::__construct($message, $code, $previous);
        $this->errorInformation = $errorInformation;
    }

    /**
     * Create response for API errors
     *
     * @return \Illuminate\Http\Response
     */
    public function response()
    {
        $data = [
            'succeed' => false,
            'error_code' => $this->getCode(),
            'error_message' => $this->getMessage(),
        ];
        if (!is_null($this->errorInformation)) {
            $data['error_information'] = $this->errorInformation;
        }
        return response()->json($data);
    }
}
