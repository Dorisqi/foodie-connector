<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Redis;
use Stripe\ApiRequestor;
use Stripe\HttpClient\CurlClient;
use Stripe\Stripe;
use Symfony\Component\Process\Process;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

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

    /** @var object process for Stripe server */
    protected $stripeProcess;

    /** @var object process for Google Maps server */
    protected $googleMapsProcess;

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
        $this->stripeProcess =
            new Process("php -S localhost:${STRIPE_MOCK_PORT} tests/Services/Stripe/server.php");
        $this->stripeProcess->start();

        // Save original values so that we can restore them after running tests
        $this->origApiBase = Stripe::$apiBase;
        $this->origApiKey = Stripe::getApiKey();
        $this->origClientId = Stripe::getClientId();
        $this->origApiVersion = Stripe::getApiVersion();
        $this->origAccountId = Stripe::getAccountId();

        // Set up host and credentials for stripe-mock
        Stripe::$apiBase = "http://localhost:${STRIPE_MOCK_PORT}";
        Stripe::setApiKey(config('services.stripe.secret'));

        // Set up google maps mocking
        $GOOGLE_MAPS_MOCK_PORT = env('GOOGLE_MAPS_MOCK_PORT');
        $this->googleMapsProcess =
            new Process("php -S localhost:${GOOGLE_MAPS_MOCK_PORT} tests/services/GoogleMaps/server.php");
        $this->googleMapsProcess->start();
        Config::set('services.google_maps.base_uri', "http://localhost:${GOOGLE_MAPS_MOCK_PORT}");
    }

    protected function tearDown()
    {
        parent::tearDown();

        $this->stripeProcess->stop();
        $this->googleMapsProcess->stop();
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

        // Strip mocking
        // Restore original values
        Stripe::$apiBase = $this->origApiBase;
        Stripe::setApiKey($this->origApiKey);
        Stripe::setClientId($this->origClientId);
        Stripe::setApiVersion($this->origApiVersion);
        Stripe::setAccountId($this->origAccountId);
    }
}
