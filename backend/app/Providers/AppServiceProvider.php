<?php

namespace App\Providers;

use App\Services\Auth\ApiGuard;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Validator::extend('zip_code', function ($attribute, $value) {
            return preg_match('/^[0-9]{5}(\-[0-9]{4})?$/', $value);
        });

        Auth::extend('api', function ($app, $name, array $config) {
            return new ApiGuard(
                Auth::createUserProvider($config['provider']),
                $app['request']
            );
        });
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
