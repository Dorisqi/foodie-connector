<?php

namespace App\Providers;

use App\Services\Auth\ApiGuard;
use Illuminate\Support\Facades\Auth;
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
        //

        Auth::extend('api', function ($app, $name, array $config) {
            return new ApiGuard(
                Auth::createUserProvider($config['provider']),
                $app['request'],
                $config['expire']
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
