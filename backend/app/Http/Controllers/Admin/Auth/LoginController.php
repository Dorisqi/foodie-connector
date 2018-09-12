<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    /**
     * Override the guard used for login
     *
     * @return Guard
     */
    protected function guard()
    {
        return Auth::guard('admin');
    }

    /**
     * Override the username filed for login
     *
     * @return string
     */
    public function username()
    {
        return 'username';
    }

    /**
     * Override the redirection after successfully logged in
     *
     * @return string
     */
    protected function redirectTo()
    {
        return route('dashboard');
    }

    /**
     * Show login form
     *
     * @return \Illuminate\Http\Response
     */
    public function showLoginForm()
    {
        return view('admin.auth.login');
    }
}
