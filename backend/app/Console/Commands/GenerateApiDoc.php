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
            'address' => [
                'description' => 'Everything about address',
                'apis' => [],
            ]
        ];
        foreach ($apis as $api) {
            $api_decoded = json_decode($api);
            $requests = [];
            foreach ($api_decoded->{'requests'} as $request) {
                array_push($requests, [
                    'description' => $request->{'description'},
                    'request' => json_encode($request->{'request'}, JSON_PRETTY_PRINT),
                    'status_code' => $request->{'status_code'},
                    'response' => json_encode($request->{'response'}, JSON_PRETTY_PRINT),
                ]);
            }
            usort($requests, function ($a, $b) {
                return $a['status_code'] - $b['status_code'];
            });
            array_push($tags[$api_decoded->{'tag'}]['apis'], [
                'method' => $api_decoded->{'method'},
                'uri' => $api_decoded->{'uri'},
                'summary' => $api_decoded->{'summary'},
                'params' => $api_decoded->{'params'},
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
        $file = fopen(base_path('/api-doc.md'), 'w') or die('Failed to open file');
        fwrite($file, view('api-doc', [
            'tags' => $tags
        ])->render());
        fclose($file);
    }
}
