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
        Route::post('resend-verification-email', 'Auth\VerificationController@resendEmail');
        Route::post('verify-email', 'Auth\VerificationController@verify');
    });

    Route::middleware('auth:api')->group(function () {
        Route::resource('addresses', 'AddressController')->only([
            'index', 'store', 'show', 'update', 'destroy'
        ]);
        Route::get('geo-coding/coords', 'AddressController@reverseGeoCodingByCoords');

        Route::resource('cards', 'CardController')->only([
            'index', 'store', 'show', 'update', 'destroy'
        ]);

        Route::resource('restaurants', 'RestaurantController')->only([
            'index', 'show',
        ]);

        Route::resource('orders', 'OrderController')->only([
            'index', 'store', 'show', 'destroy',
        ]);
        Route::post('orders/{id}/invitation', 'OrderController@invite');
        Route::post('orders/{id}/join', 'OrderController@join');
        Route::post('orders/{id}/checkout', 'OrderController@checkout');
        Route::post('orders/{id}/pay', 'OrderController@pay');
        Route::post('orders/{id}/confirm', 'OrderController@confirm');
        Route::post('orders/{id}/rate', 'OrderController@rate');

        Route::resource('friends', 'FriendController')->only([
            'index', 'store', 'destroy',
        ]);

        Route::put('cart', 'CartController@update');
        Route::get('cart', 'CartController@show');

        Route::prefix('profile')->group(function () {
            Route::get('', 'ProfileController@show');
            Route::put('', 'ProfileController@update');
            Route::put('password', 'ProfileController@changePassword');
            Route::put('email', 'ProfileController@updateEmail');
        });

        Route::post('pusher/auth', 'PusherController@auth');
    });
});
