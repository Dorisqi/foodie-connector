<?php

namespace App\Http\Controllers;

use App\Exceptions\ApiException;
use Illuminate\Http\Request;
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
        return response()->json($data ?? []);
    }

    /**
     * Validate the input
     *
     * @param \Illuminate\Http\Request $request
     * @return void
     *
     * @throws \App\Exceptions\ApiException
     */
    protected function validateInput(Request $request)
    {
        $validator = Validator::make($request->all(), $this->rules());
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
}
