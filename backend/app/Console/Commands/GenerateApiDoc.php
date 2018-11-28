<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class GenerateApiDoc extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'api-doc:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate API doc';

    /**
     * The order of HTTP method
     */
    protected const METHOD_ORDER = [
        'GET' => 0,
        'POST' => 1,
        'PUT' => 2,
        'PATCH' => 3,
        'DELETE' => 4,
    ];

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return void
     *
     * @throws \Throwable
     */
    public function handle()
    {
        $apis = DB::connection('sqlite_api_doc')
            ->table('apis')
            ->pluck('value');
        $tags = [
            'authentication' => [
                'description' => 'Everything about authentication',
                'apis' => [],
            ],
            'profile' => [
                'description' => 'Everything about profile',
                'apis' => [],
            ],
            'address' => [
                'description' => 'Everything about address',
                'apis' => [],
            ],
            'card' => [
                'description' => 'Everything about card',
                'apis' => [],
            ],
            'restaurant' => [
                'description' => 'Everything about restaurant',
                'apis' => [],
            ],
            'cart' => [
                'description' => 'Everything about cart',
                'apis' => [],
            ],
            'order' => [
                'description' => 'Everything about order',
                'apis' => [],
            ],
            'friend' => [
                'description' => 'Everything about friend',
                'apis' => [],
            ],
        ];
        $mockData = [];
        foreach ($apis as $api) {
            $apiDecoded = json_decode($api, true);
            $requests = [];
            foreach ($apiDecoded['requests'] as $request) {
                array_push($requests, [
                    'description' => $request['description'],
                    'uri' => $request['uri'],
                    'header' => $request['header'],
                    'request' => is_null($request['request'])
                        ? null
                        : json_encode($request['request'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES),
                    'status_code' => $request['status_code'],
                    'response' => is_null($request['response'])
                        ? null
                        : json_encode($request['response'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES),
                    'response_header' => is_null($request['response_header'])
                        ? null
                        : json_encode($request['response_header'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES),
                ]);
                $mockRequest = [
                    'header' => empty($request['header']) ? null : $request['header'],
                    'request' => is_null($request['request'])
                        ? null
                        : $request['request'],
                    'status_code' => $request['status_code'],
                    'response' => is_null($request['response'])
                        ? null
                        : $request['response'],
                    'response_header' => is_null($request['response_header'])
                        ? null
                        : $request['response_header'],
                ];
                if (!isset($mockData[$request['uri']])) {
                    $mockData[$request['uri']] = [];
                }
                $mockDataUri = &$mockData[$request['uri']];
                if (!isset($mockDataUri[$apiDecoded['method']])) {
                    $mockDataUri[$apiDecoded['method']] = [];
                }
                array_push($mockDataUri[$apiDecoded['method']], $mockRequest);
            }
            usort($requests, function ($a, $b) {
                return $a['status_code'] - $b['status_code'];
            });
            array_push($tags[$apiDecoded['tag']]['apis'], [
                'method' => $apiDecoded['method'],
                'uri' => $apiDecoded['uri'],
                'summary' => $apiDecoded['summary'],
                'authorization' => $apiDecoded['authorization'],
                'params' => $apiDecoded['params'],
                'requests' => $requests,
            ]);
        }
        foreach ($tags as $name => $tag) {
            usort($tags[$name]['apis'], function ($a, $b) {
                if ($a['uri'] === $b['uri']) {
                    return $this::METHOD_ORDER[$a['method']]
                        <=> $this::METHOD_ORDER[$b['method']];
                }
                return $a['uri'] <=> $b['uri'];
            });
        }
        file_put_contents(base_path('/api-doc.md'), view('api-doc', [
            'tags' => $tags
        ])->render());
        file_put_contents(
            base_path('../frontend/src/__mocks__/api/mock-data.json'),
            json_encode($mockData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
        );
    }
}
