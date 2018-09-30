<?php

namespace App\Http\Controllers;

use App\Exceptions\ApiException;
use App\Models\ApiUser;
use Illuminate\Cache\RateLimiter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ApiController extends Controller
{
    /**
     * Create response for a successful API call
     *
     * @param mixed $data [optional] Data to be returned to the client
     * @return \Illuminate\Http\JsonResponse
     */
    protected function response($data = null)
    {
        return is_null($data)
            ? response()->make()
            : response()->json($data);
    }

    /**
     * Validate the input
     *
     * @param \Illuminate\Http\Request $request
     * @param array $rules [optional]
     * @return void
     *
     * @throws \App\Exceptions\ApiException
     */
    protected function validateInput(Request $request, array $rules = null)
    {
        $validator = Validator::make($request->all(), $rules ?? $this->rules());
        if ($validator->fails()) {
            throw ApiException::validationFailed($validator);
        }
    }

    /**
     * Get the validation rules
     *
     * @return array
     */
    public static function rules()
    {
        return [];
    }

    /**
     * Get the guard
     *
     * @return \App\Services\Auth\ApiGuard
     */
    protected function guard()
    {
        return Auth::guard('api');
    }

    /**
     * Get the current user
     *
     * @return \App\Models\ApiUser
     */
    protected function user()
    {
        return $this->guard()->user();
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
     * Get the guard config
     */
    protected function guardConfig()
    {
        return config('auth.guards.api');
    }
}
