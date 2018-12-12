<?php

namespace Tests;

use App\Facades\Time;
use App\Models\ApiUser;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Stripe\Stripe;
use Symfony\Component\Process\Process;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected static $initialized = false;

    /** @var object stripe mock process */
    protected static $stripeProcess;

    /** @var object google maps mock process */
    protected static $googleMapsProcess;

    public static function setUpBeforeClass()
    {
        parent::setUpBeforeClass();

        $stripePort = env('STRIPE_MOCK_PORT');
        self::$stripeProcess =
            new Process("php -S localhost:${stripePort} tests/Services/Stripe/server.php");
        self::$stripeProcess->start();
        $googleMapsPort = env('GOOGLE_MAPS_MOCK_PORT');
        self::$googleMapsProcess =
            new Process("php -S localhost:${googleMapsPort} tests/Services/GoogleMaps/server.php");
        self::$googleMapsProcess->start();
    }

    public static function tearDownAfterClass()
    {
        parent::tearDownAfterClass();

        self::$stripeProcess->stop();
        self::$googleMapsProcess->stop();
    }

    /**
     * Setup the test environment.
     *
     * @return void
     *
     * @throws \ReflectionException
     */
    protected function setUp()
    {
        parent::setUp();

        Redis::flushall();

        // Initialize only once
        if (!$this::$initialized) {
            // Migrate database
            Artisan::call('migrate');

            $this::$initialized = true;
        }

        // Stripe mocking
        $STRIPE_MOCK_PORT = env('STRIPE_MOCK_PORT');
        Stripe::$apiBase = "http://localhost:${STRIPE_MOCK_PORT}";
        Stripe::setApiKey(config('services.stripe.secret'));

        // Set up google maps mocking
        $GOOGLE_MAPS_MOCK_PORT = env('GOOGLE_MAPS_MOCK_PORT');
        Config::set('services.google_maps.base_uri', "http://localhost:${GOOGLE_MAPS_MOCK_PORT}");

        // Truncate all database tables
        DB::statement('SET FOREIGN_KEY_CHECKS = 0');
        $tables = DB::select('SHOW TABLES');
        foreach ($tables as $table) {
            foreach ($table as $tableName) {
                if ($tableName === 'migrations') {
                    continue;
                }
                DB::table($tableName)->truncate();
            }
        }
        DB::statement('SET FOREIGN_KEY_CHECKS = 1');

        $this->mockCurrentTime('2018-10-27 15:00:01');
    }

    protected function tearDown()
    {
        parent::tearDown();
    }

    /**
     * Mock current time
     *
     * @param string $time
     * @return void
     */
    protected function mockCurrentTime($time)
    {
        $property = new \ReflectionProperty(Time::class, 'currentTimeStamp');
        $property->setAccessible(true);
        $property->setValue(Carbon::parse($time)->timestamp);
    }

    /**
     * Login for authorization
     *
     * @param \App\Models\ApiUser $user [optional]
     * @return void
     */
    protected function login(ApiUser $user = null)
    {
        $this->guard()->login($user ?? $this->userFactory()->create());
        $this->token = $this->guard()->token();
    }

    /**
     * Get the guard
     *
     * @return \App\Services\Auth\ApiGuard
     */
    protected function guard()
    {
        return Auth::guard('api');
    }

    /**
     * Get user factory
     *
     * @return \Illuminate\Database\Eloquent\FactoryBuilder
     */
    protected function userFactory()
    {
        return factory(ApiUser::class);
    }

    /**
     * Get the current user
     *
     * @return \App\Models\ApiUser
     */
    protected function user()
    {
        return $this->guard()->user();
    }

    /**
     * Get the guard config
     *
     * @return array
     */
    protected function guardConfig()
    {
        return config('auth.guards.api');
    }
}
