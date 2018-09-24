<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestResponse;
use Illuminate\Support\Facades\DB;

abstract class ApiTestCase extends TestCase
{
    /**
     * API doc
     *
     * @var array
     */
    protected $requests = [];

    /**
     * Insert record into request list
     *
     * @param array $data
     * @param \Illuminate\Foundation\Testing\TestResponse $response
     * @return void
     */
    protected function insertRequest(array $data, TestResponse $response)
    {
        $api = [
            'request' => $data,
            'status_code' => $response->status(),
            'description' => $response->status() == 200
                ? 'Successful operation'
                : $response->json('message'),
            'response' => $response->json(),
        ];
        array_push($this->requests, $api);
    }

    /**
     * Setup the test environment.
     *
     * @return void
     */
    protected function setUp()
    {
        parent::setUp();

        $this->beforeApplicationDestroyed(function () {
            DB::connection('sqlite_api_doc')
                ->table('apis')
                ->insert([
                    'value' => json_encode([
                        'method' => $this->method(),
                        'uri' => $this->uri(),
                        'summary' => $this->summary(),
                        'tag' => $this->tag(),
                        'requests' => $this->requests
                    ]),
                ]);
        });
    }

    /**
     * Assert JSON API succeed
     *
     * @param array $data
     * @param bool $documented [optional]
     * @return void
     */
    protected function assertSucceed(array $data, bool $documented = true)
    {
        $response = $this->json($this->method(), $this->uri(), $data);
        $response->assertStatus(200);
        if ($documented) {
            $this->insertRequest($data, $response);
        }
    }

    /**
     * Assert JSON API Failed
     *
     * @param array $data
     * @param int $code
     * @param bool $documented [optional]
     * @return void
     */
    protected function assertFailed(array $data, int $code, bool $documented = true)
    {
        $response = $this->json($this->method(), $this->uri(), $data);
        $response->assertStatus($code);
        if ($documented) {
            $this->insertRequest($data, $response);
        }
    }

    /**
     * Get the API method
     *
     * @return string
     */
    protected function method()
    {
        return 'GET';
    }

    /**
     * Get the API uri
     *
     * @return string
     */
    protected function uri()
    {
        throw new \BadMethodCallException('uri() not implemented');
    }

    /**
     * Get the API summary
     *
     * @return string
     */
    protected function summary()
    {
        throw new \BadMethodCallException('summary() not implemented');
    }

    /**
     * Get the tag
     *
     * @return string
     */
    protected function tag()
    {
        throw new \BadMethodCallException('tag() not implemented');
    }
}
