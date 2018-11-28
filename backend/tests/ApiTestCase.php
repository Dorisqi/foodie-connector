<?php

namespace Tests;

use Illuminate\Cache\RateLimiter;
use Illuminate\Foundation\Testing\TestResponse;
use Illuminate\Support\Facades\DB;

abstract class ApiTestCase extends TestCase
{
    /**
     * API prefix
     */
    protected const PREFIX = '/api/v1';

    /**
     * The api is documented
     *
     * @var bool
     */
    protected $documented = true;

    /**
     * API doc
     *
     * @var array
     */
    protected $requests = [];

    /**
     * API token
     *
     * @var string|null
     */
    protected $token = null;

    /**
     * Insert record into request list
     *
     * @param array|null $requestData
     * @param \Illuminate\Foundation\Testing\TestResponse $response
     * @param array|null $documentedRequest [optional]
     * @return void
     */
    protected function insertRequest($requestData, TestResponse $response, $documentedRequest = null)
    {
        if (is_null(env('GENERATE_API_DOC'))) {
            return;
        }
        if (!is_null($documentedRequest)) {
            foreach ($documentedRequest as $key => $value) {
                $requestData[$key] = $value;
            }
        }
        $api = [
            'uri' => $this->processedUri($requestData),
            'request' => $this->method() === 'GET' ? null : $requestData,
            'status_code' => $response->status(),
            'header' => is_null($this->token) ? [] : [
                'Authorization' => $this->token,
            ],
            'description' => $response->status() == 200
                ? 'Successful operation.'
                : $response->json('message'),
            'response_header' => null,
            'response' => empty($response->content()) ? null : $response->json(),
        ];
        array_push($this->requests, $api);
        $response->api = true;
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

        if (!is_null(env('GENERATE_API_DOC')) && $this->documented) {
            $this->beforeApplicationDestroyed(function () {
                DB::connection('sqlite_api_doc')
                    ->table('apis')
                    ->insert([
                        'value' => json_encode([
                            'method' => $this->method(),
                            'uri' => $this::PREFIX . $this->uri(),
                            'summary' => $this->summary(),
                            'tag' => $this->tag(),
                            'authorization' => !is_null($this->token),
                            'params' => $this->params(),
                            'requests' => $this->requests
                        ]),
                    ]);
            });
        }
    }

    /**
     * Assert JSON API succeed
     *
     * @param array|null $data
     * @param bool $documented [optional]
     * @param array|null $documentedRequest [optional]
     * @return \Illuminate\Foundation\Testing\TestResponse
     */
    protected function assertSucceed($data, bool $documented = true, $documentedRequest = null)
    {
        $response = $this->request($data);
        if ($response->status() !== 200) {
            echo $response->content();
        }
        $response->assertStatus(200);
        if ($documented && $this->documented) {
            $this->insertRequest($data, $response, $documentedRequest);
        }
        return $response;
    }

    /**
     * Assert JSON API Failed
     *
     * @param array|null $data
     * @param int $code
     * @param bool $documented [optional]
     * @return \Illuminate\Foundation\Testing\TestResponse
     */
    protected function assertFailed($data, int $code, bool $documented = true)
    {
        $response = $this->request($data);
        if ($response->status() !== $code) {
            echo $response->content();
        }
        $response->assertStatus($code);
        if ($documented && $this->documented) {
            $this->insertRequest($data, $response);
        }
        return $response;
    }

    /**
     * Assert throttle headers
     *
     * @param \Illuminate\Foundation\Testing\TestResponse
     * @param int $limit
     * @param int $remaining
     * @param int $retryAfter [optional]
     * @return void
     */
    protected function assertThrottle(TestResponse $response, int $limit, int $remaining, int $retryAfter = null)
    {
        $response->assertHeader('X-RateLimit-Limit', $limit);
        $response->assertHeader('X-RateLimit-Remaining', $remaining);
        $response_header = [
            'X-RateLimit-Limit' => $limit,
            'X-RateLimit-Remaining' => $remaining,
        ];
        if (!is_null($retryAfter)) {
            $response->assertHeader('Retry-After');
            $response_header['Retry-After'] = $retryAfter;
        }
        if (isset($response->api)) {
            $this->requests[count($this->requests) - 1]['response_header'] = $response_header;
        }
    }

    /**
     * Set response in the document
     *
     * @param mixed $response
     * @return void
     */
    protected function setDocumentResponse($response)
    {
        if (is_null(env('GENERATE_API_DOC'))) {
            return;
        }
        $this->requests[count($this->requests) - 1]['response'] = array_merge(
            $this->requests[count($this->requests) - 1]['response'],
            $response
        );
    }

    /**
     * Limit the array length for response body in document
     *
     * @param array $original
     * @param int $length
     * @return array
     */
    protected function limitArrayLength(array $original, int $length)
    {
        if (count($original) <= $length) {
            return $original;
        }
        $limited = array_slice($original, 0, $length);
        array_push($limited, '...');
        return $limited;
    }

    /**
     * Make request
     *
     * @param array|null $data
     * @return \Illuminate\Foundation\Testing\TestResponse
     */
    protected function request($data)
    {
        $request = $this;
        if (!is_null($this->token)) {
            $request->withHeader('Authorization', $this->token);
        }
        return is_null($data)
            ? $request->call($this->method(), $this->processedUri($data))
            : $request->json($this->method(), $this->processedUri($data), $data);
    }

    /**
     * Get the processed uri
     *
     * @param array|null $requestData
     * @return string
     */
    protected function processedUri($requestData)
    {
        $uri = $this->uri();
        foreach ($this->uriParams() as $key => $value) {
            $uri = str_replace('{' . $key . '}', $value, $uri);
        }
        if ($this->method() === 'GET' && !is_null($requestData)) {
            $queryAdded = false;
            foreach ($requestData as $key => $value) {
                $uri .= ($queryAdded ? '&' : '?') . urlencode($key) . '=' . urlencode($value);
                $queryAdded = true;
            }
        }
        return $this::PREFIX . $uri;
    }

    /**
     * Get the rate limiter
     *
     * @return \Illuminate\Cache\RateLimiter
     */
    protected function limiter()
    {
        return app(RateLimiter::class);
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
     * Get the uri params
     *
     * @return array
     */
    protected function uriParams()
    {
        return [];
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

    /**
     * Get validation rules
     *
     * @return array
     */
    protected function rules()
    {
        throw new \BadMethodCallException('rules() not implemented');
    }

    /**
     * Get params
     *
     * @return array
     */
    protected function params()
    {
        $params = [];
        foreach ($this->rules() as $key => $rule) {
            $restrictions = is_string($rule) ? explode('|', $rule) : $rule;
            $param = [
                'key' => $key,
            ];
            $extra = [];
            foreach ($restrictions as $restriction) {
                switch ($restriction) {
                    case 'required':
                        $param['required'] = true;
                        break;
                    case 'string':
                    case 'boolean':
                    case 'numeric':
                    case 'integer':
                    case 'phone:US':
                    case 'zip_code':
                    case 'password':
                    case 'array':
                        $param['type'] = $restriction;
                        break;
                    case 'email':
                        $param['email'] = true;
                        break;
                    default:
                        if (is_string($restriction)) {
                            array_push($extra, $restriction);
                        }
                }
            }
            $param['extra'] = implode(', ', $extra);
            array_push($params, $param);
        }
        return $params;
    }
}
