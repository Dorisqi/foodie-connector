<?php

namespace App\Services\Auth;

use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Auth\GuardHelpers;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Http\Request;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;

class ApiGuard implements StatefulGuard
{
    use GuardHelpers;

    /**
     * The length of the token
     */
    private const TOKEN_BYTES = 32;

    /**
     * The request instance
     *
     * @var \Illuminate\Http\Request
     */
    protected $request;

    /**
     * The API token
     *
     * @var string
     */
    protected $token;

    /**
     * The input key from request
     *
     * @var string
     */
    protected $inputKey;

    /**
     * The storage key used in Redis
     *
     * @var string
     */
    protected $storageKey;

    /**
     * The expire time in seconds
     *
     * @var int
     */
    protected $expire;

    /**
     * Indicate if the logout method has been called.
     *
     * @var bool
     */
    protected $loggedOut = false;

    /**
     * The user we last attempted to retrieve.
     *
     * @var \Illuminate\Contracts\Auth\Authenticatable
     */
    protected $lastAttempted;

    /**
     * Create a new authentication guard.
     *
     * @param \Illuminate\Contracts\Auth\UserProvider $provider
     * @param \Illuminate\Http\Request $request
     * @param int $expire
     * @param string $inputKey [optional]
     * @param string $storageKey [optional]
     */
    public function __construct(
        UserProvider $provider,
        Request $request,
        int $expire,
        string $inputKey = 'api_token',
        string $storageKey = 'api_token'
    ) {
        $this->provider = $provider;
        $this->request = $request;
        $this->expire = $expire;
        $this->inputKey = $inputKey;
        $this->storageKey = $storageKey;
    }

    /**
     * Get the current authenticated user
     *
     * @return \Illuminate\Contracts\Auth\Authenticatable|null
     */
    public function user()
    {
        if ($this->loggedOut) {
            return null;
        }

        if (!is_null($this->user)) {
            return $this->user;
        }

        $encodedToken = $this->request->header($this->inputKey);
        if (is_null($encodedToken)) {
            return null;
        }
        $decodedToken = base64_decode($encodedToken);
        if (!$decodedToken) {
            return null;
        }
        $token = substr($decodedToken, 0, 2 * $this::TOKEN_BYTES);
        if (!$token) {
            return null;
        }
        $id = substr($decodedToken, 2 * $this::TOKEN_BYTES);
        if (!$id) {
            return null;
        }
        $result = Redis::expire($this->redisKey($id, $token), $this->expire);
        if ($result !== 1) {
            return null;
        }
        $this->token = $token;
        $this->user = $this->provider->retrieveById($id);

        return $this->user;
    }

    /**
     * Get the ID for the currently authenticated user.
     *
     * @return int|null
     */
    public function id()
    {
        if ($this->loggedOut) {
            return null;
        }

        return $this->user()
            ? $this->user()->getAuthIdentifier()
            : null; // TODO
    }

    /**
     * Get the API token
     *
     * @return string|null
     */
    public function token()
    {
        return base64_encode($this->token . $this->user()->getAuthIdentifier());
    }

    /**
     * Attempt to authenticate a user using the given credentials.
     *
     * @param  array  $credentials
     * @param  bool   $remember
     * @return bool
     */
    public function attempt(array $credentials = [], $remember = false)
    {
        $user = $this->provider->retrieveByCredentials($credentials);

        // If an implementation of UserInterface was returned, we'll ask the provider
        // to validate the user against the given credentials, and if they are in
        // fact valid we'll log the users into the application and return true.
        if ($this->hasValidCredentials($user, $credentials)) {
            $this->login($user);

            return true;
        }

        return false;
    }

    /**
     * Validate a user's credentials.
     *
     * @param  array  $credentials
     * @return bool
     */
    public function validate(array $credentials = [])
    {
        $this->lastAttempted = $user = $this->provider->retrieveByCredentials($credentials);

        return $this->hasValidCredentials($user, $credentials);
    }

    /**
     * Log the given user ID into the application without sessions or cookies.
     *
     * @param  mixed  $id
     * @return \Illuminate\Contracts\Auth\Authenticatable|false
     */
    public function onceUsingId($id)
    {
        if (!is_null($user = $this->provider->retrieveById($id))) {
            $this->setUser($user);

            return $user;
        }

        return false;
    }

    /**
     * Log a user into the application without sessions or cookies.
     *
     * @param  array  $credentials
     * @return bool
     */
    public function once(array $credentials = [])
    {
        if ($this->validate($credentials)) {
            $this->setUser($this->lastAttempted);

            return true;
        }

        return false;
    }

    /**
     * Determine if the user matches the credentials.
     *
     * @param  mixed  $user
     * @param  array  $credentials
     * @return bool
     */
    protected function hasValidCredentials($user, $credentials)
    {
        return ! is_null($user) && $this->provider->validateCredentials($user, $credentials);
    }

    /**
     * Log the given user ID into the application.
     *
     * @param  mixed  $id
     * @param  bool   $remember
     * @return \Illuminate\Contracts\Auth\Authenticatable|false
     */
    public function loginUsingId($id, $remember = false)
    {
        if (!is_null($user = $this->provider->retrieveById($id))) {
            $this->login($user, $remember);
            return $user;
        }

        return false;
    }

    /**
     * Log a user into the application.
     *
     * @param  \Illuminate\Contracts\Auth\Authenticatable  $user
     * @param  bool  $remember
     */
    public function login(Authenticatable $user, $remember = false)
    {
        $this->setUser($user);
        $this->generateToken();
    }

    /**
     * Determine if the user was authenticated via "remember me" cookie.
     *
     * @return bool
     */
    public function viaRemember()
    {
        return false;
    }

    /**
     * Log the user out of the application.
     *
     * @return void
     */
    public function logout()
    {
        $this->removeToken();

        // Once we have fired the logout event we will clear the users out of memory
        // so they are no longer available as the user is no longer considered as
        // being signed into this application and should not be available here.
        $this->user = null;

        $this->loggedOut = true;
    }

    /**
     * Generate token and store in Redis
     */
    protected function generateToken()
    {
        $token = openssl_random_pseudo_bytes($this::TOKEN_BYTES);
        $this->token = bin2hex($token);
        if (is_null(Redis::set($this->redisKey(), true, 'NX', 'EX', $this->expire))) {
            $this->generateToken();
        }
    }

    /**
     * Remove token from the Redis
     */
    protected function removeToken()
    {
        Redis::del($this->redisKey());
    }

    /**
     * Get the redis key
     *
     * @param mixed $identifier [optional]
     * @param string $token [optional]
     * @return string
     */
    protected function redisKey($identifier = null, string $token = null)
    {
        return $this->storageKey . ':' .
            ($identifier ?? $this->user()->getAuthIdentifier()) . ':' .
            ($token ?? $this->token);
    }
}
