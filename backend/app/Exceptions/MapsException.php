<?php

namespace App\Exceptions;

use \Exception;
use Throwable;

class MapsException extends Exception
{
    /**
     * Create a new MapsException instance
     *
     * @param string $message
     * @param int $code
     * @param Throwable $previous
     * @return void
     */
    public function __construct(string $message = "", int $code = 0, Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
