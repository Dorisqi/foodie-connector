<?php

namespace App\Http\Controllers\Auth;

use App\Brokers\VerifyEmailBroker;
use Illuminate\Support\Facades\Auth;
use App\Exceptions\ApiException;
use App\Models\ApiUser;
use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Stripe\Customer;

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
        $this->middleware('stripe');
    }

    /**
     * Handle a registration request for the application.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \App\Exceptions\ApiException
     * @throws \Exception
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), $this::rules());
        if ($validator->fails()) {
            if (isset($validator->failed()['email']['Unique'])) {
                throw ApiException::emailExists();
            }
            throw ApiException::validationFailed($validator);
        }

        try {
            DB::beginTransaction();

            $user = ApiUser::create([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'password' => Hash::make($request->input('password')),
            ]);

            $customer = Customer::create([
                'description' => 'ApiUser-' . $user->id,
            ]);
            $user->stripe_id = $customer->id;
            $user->save();

            VerifyEmailBroker::sendVerificationEmail($this->limiter(), $user);

            $this->guard()->loginUsingId($user->getAuthIdentifier());

            DB::commit();
        } catch (\Exception $exception) {
            DB::rollBack();
            throw $exception;
        }

        return $this->response([
            'api_token' => Auth::guard('api')->token(),
            'user' => Auth::guard('api')->user(),
        ]);
    }

    /**
     * Get the validation rules
     *
     * @return array
     */
    public static function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:api_users',
            'password' => 'required|password',
        ];
    }
}
