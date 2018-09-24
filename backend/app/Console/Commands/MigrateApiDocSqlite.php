<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class MigrateApiDocSqlite extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrate:api-doc';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate API doc Sqlite';

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
     */
    public function handle()
    {
        Schema::connection('sqlite_api_doc')
            ->dropIfExists('apis');
        Schema::connection('sqlite_api_doc')
            ->create('apis', function (Blueprint $table) {
                $table->increments('id');
                $table->longText('value');
            });
    }
}
