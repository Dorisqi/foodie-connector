<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Redis;
use Stripe\Stripe;
use Symfony\Component\Process\Process;
use Illuminate\Support\Facades\Artisan;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    /** @var object stripe mock process */
    protected static $stripeProcess;

    /** @var object google maps mock process */
    protected static $googleMapsProcess;

    /** @var string original API base URL */
    protected $origApiBase;

    /** @var string original API key */
    protected $origApiKey;

    /** @var string original client ID */
    protected $origClientId;

    /** @var string original API version */
    protected $origApiVersion;

    /** @var string original account ID */
    protected $origAccountId;

    /** @var object HTTP client mocker */
    protected $clientMock;

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
     */
    protected function setUp()
    {
        parent::setUp();

        $this->runDatabaseMigrations();

        // Stripe mocking
        $STRIPE_MOCK_PORT = env('STRIPE_MOCK_PORT');
        $this->origApiBase = Stripe::$apiBase;
        $this->origApiKey = Stripe::getApiKey();
        $this->origClientId = Stripe::getClientId();
        $this->origApiVersion = Stripe::getApiVersion();
        $this->origAccountId = Stripe::getAccountId();
        Stripe::$apiBase = "http://localhost:${STRIPE_MOCK_PORT}";
        Stripe::setApiKey(config('services.stripe.secret'));

        // Set up google maps mocking
        $GOOGLE_MAPS_MOCK_PORT = env('GOOGLE_MAPS_MOCK_PORT');
        Config::set('services.google_maps.base_uri', "http://localhost:${GOOGLE_MAPS_MOCK_PORT}");
    }

    protected function tearDown()
    {
        parent::tearDown();
    }

    /**
     * Define hooks to migrate the database before and after each test.
     *
     * @return void
     */
    public function runDatabaseMigrations()
    {
        Redis::flushall();

        $this->artisan('migrate:fresh');

        $this->app[Kernel::class]->setArtisan(null);
    }

    /**
     * Seed restaurant data
     *
     * @return void
     */
    protected function seedRestaurantData()
    {
        Artisan::call('db:seed', ['--class' => 'RestaurantsTestSeeder']);
    }
}
