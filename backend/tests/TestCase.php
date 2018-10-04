<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\Redis;
use Stripe\ApiRequestor;
use Stripe\HttpClient\CurlClient;
use Stripe\Stripe;

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
        // Save original values so that we can restore them after running tests
        $this->origApiBase = Stripe::$apiBase;
        $this->origApiKey = Stripe::getApiKey();
        $this->origClientId = Stripe::getClientId();
        $this->origApiVersion = Stripe::getApiVersion();
        $this->origAccountId = Stripe::getAccountId();

        // Set up host and credentials for stripe-mock
        Stripe::$apiBase = "http://localhost:" . env('STRIPE_MOCK_PORT');
        Stripe::setApiKey("sk_test_123");
        Stripe::setClientId("ca_123");
        Stripe::setApiVersion(null);
        Stripe::setAccountId(null);

        // Set up the HTTP client mocker
        // $this->clientMock = $this->getMock('\Stripe\HttpClient\ClientInterface');

        // By default, use the real HTTP client
        ApiRequestor::setHttpClient(CurlClient::instance());
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
