<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

/* Route::name('admin.')->group(function () {
    Route::prefix('admin')->group(function () {
        Route::get('/login', 'Admin\Auth\LoginController@showLoginForm')->name('login');
        Route::post('/login', 'Admin\Auth\LoginController@login');
        Route::post('/logout', 'Admin\Auth\LoginController@logout')->name('logout');
        Route::group(['middleware' => 'auth:admin'], function () {
            Route::get('/', 'Admin\DashboardController@index')->name('dashboard');
        });
    });
}); */

// Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');


Route::group(['prefix' => 'admin'], function () {
    Voyager::routes();
});
