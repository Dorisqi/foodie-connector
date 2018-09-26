<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::prefix('v1')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('register', 'Auth\RegisterController@register');
        Route::post('login', 'Auth\LoginController@login');
        Route::post('reset-password-email', 'Auth\ForgotPasswordController@sendResetLinkEmail');
        Route::post('reset-password', 'Auth\ResetPasswordController@reset');
    });

    Route::middleware('auth:api')->group(function () {
        Route::resource('addresses', 'AddressController')->only([
            'index', 'store', 'show', 'update', 'destroy'
        ]);

        Route::prefix('profile')->group(function () {
            Route::get('', 'ProfileController@show');
            Route::put('password', 'ProfileController@changePassword');
        });
    });
});
