<?php

namespace App\Http\Controllers\Auth;

use App\Exceptions\ApiException;
use App\Models\ApiUser;
use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class RegisterController extends ApiController
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

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
     * Handle a registration request for the application.
     *
     * @throws ApiException
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:api_users',
            'password' => 'required|string|min:6',
        ]);
        if ($validator->fails()) {
            if (isset($validator->failed()['email']['Unique'])) {
                throw ApiException::EmailExists();
            }
            throw ApiException::ValidationFailed($validator);
        }

        $data = $request->all();
        $user = ApiUser::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        // TODO: login after registered
        // Auth::guard('api')->login($user);

        return $this->response([
            'id' => $user->id,
        ]);
    }

}
