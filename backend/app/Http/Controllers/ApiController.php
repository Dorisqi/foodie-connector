<?php

namespace App\Http\Controllers;

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
}
