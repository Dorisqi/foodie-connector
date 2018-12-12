<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class GenerateVoyagerSeederData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'generate:voyager-seeder-data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate voyager seeder data from the current database';

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
        $tables = ['data_types', 'data_rows', 'permissions', 'menu_items'];
        $data = [];
        foreach ($tables as $table) {
            $data[$table] = DB::table($table)->get();
        }
        $path = database_path('seeds/data/voyager.json');
        file_put_contents($path, json_encode($data));
        $this->info("Seeder data has been generated and saved in ${path}.");
    }
}
