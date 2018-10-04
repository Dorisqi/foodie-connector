<?php

namespace App\Providers;

use App\Services\Auth\ApiGuard;
use Illuminate\Routing\UrlGenerator;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @param \Illuminate\Routing\UrlGenerator $url
     * @return void
     */
    public function boot(UrlGenerator $url)
    {
        Validator::extend('zip_code', function ($attribute, $value) {
            return preg_match('/^[0-9]{5}(\-[0-9]{4})?$/', $value);
        });

        Validator::extend('password', function ($attribute, $value) {
            return strlen($value) >= 6; // TODO: password complexity check
        });

        Auth::extend('api', function ($app, $name, array $config) {
            return new ApiGuard(
                Auth::createUserProvider($config['provider']),
                $app['request']
            );
        });

        if (App::environment('prod')) {
            $url->forceScheme('https');
        }
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
