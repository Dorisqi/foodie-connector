<?php

namespace App\Http\Middleware;

use Closure;
use Stripe\Stripe;

class StripeAPI
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        Stripe::setApiKey(config('services.stripe.secret'));
        return $next($request);
    }
}
