<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Foundation\Testing\RefreshDatabaseState;
use Illuminate\Foundation\Testing\TestResponse;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    /**
     * Setup the test environment.
     *
     * @return void
     */
    protected function setUp()
    {
        parent::setUp();

        $this->runDatabaseMigrations();
    }

    /**
     * Define hooks to migrate the database before and after each test.
     *
     * @return void
     */
    public function runDatabaseMigrations()
    {
        $this->artisan('migrate:fresh');

        $this->app[Kernel::class]->setArtisan(null);

        $this->beforeApplicationDestroyed(function () {
            // $this->artisan('migrate:rollback');

            RefreshDatabaseState::$migrated = false;
        });
    }

    /**
     * Assert JSON API succeed
     *
     * @param array $data
     * @return void
     */
    protected function assertSucceed(array $data)
    {
        $response = $this->json($this->method(), $this->uri(), $data);
        $response->assertJson([
            'succeed' => true,
            'error_code' => 0,
        ]);
    }

    /**
     * Assert JSON API Failed
     *
     * @param array $data
     * @param int $code
     * @return void
     */
    protected function assertFailed(array $data, int $code)
    {
        $response = $this->json($this->method(), $this->uri(), $data);
        $response->assertJson([
            'succeed' => false,
            'error_code' => $code,
        ]);
    }

    /**
     * Return the API method
     *
     * @return string
     */
    protected function method()
    {
        return 'GET';
    }

    /**
     * Return the API uri
     *
     * @return string
     */
    protected function uri()
    {
        throw new \BadMethodCallException('uri not implemented');
    }
}
