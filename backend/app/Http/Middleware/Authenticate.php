<?php

namespace App\Http\Middleware;

use App\Exceptions\ApiException;
use Closure;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string[]  ...$guards
     * @return mixed
     *
     * @throws \Illuminate\Auth\AuthenticationException
     * @throws \App\Exceptions\ApiException
     */
    public function handle($request, Closure $next, ...$guards)
    {
        try {
            $this->authenticate($request, $guards);
        } catch (AuthenticationException $exception) {
            $redirectPath = '';
            $guard = $exception->guards()[0];
            switch ($guard) {
                case 'admin':
                    $redirectPath = route('admin.login');
                    break;
                case 'api':
                    throw ApiException::requireAuthentication();
            }
            throw new AuthenticationException(
                $exception->getMessage(),
                $exception->guards(),
                $redirectPath
            );
        }

        return $next($request);
    }
}
