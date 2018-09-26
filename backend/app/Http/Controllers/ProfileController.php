<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends ApiController
{
    /**
     * Show the profile
     *
     * @param \Illuminate\Http\Request
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request)
    {
        return $this->response(Auth::guard('api')->user());
    }
}
