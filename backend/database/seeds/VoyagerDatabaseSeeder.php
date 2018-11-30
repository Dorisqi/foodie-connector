<?php

use Illuminate\Database\Seeder;
use TCG\Voyager\Traits\Seedable;

class VoyagerDatabaseSeeder extends Seeder
{
    use Seedable;

    protected $seedersPath = __DIR__.'/';

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = json_decode(file_get_contents(database_path('seeds/data/voyager.json')), true);
        foreach ($data as $table => $tableData) {
            $this->command->info("Seeding ${table}.");
            \Illuminate\Support\Facades\DB::table($table)->delete();
            \Illuminate\Support\Facades\DB::table($table)->insert($tableData);
        }

//        $this->seed('DataTypesTableSeeder');
//        $this->seed('DataRowsTableSeeder');
        $this->seed('MenusTableSeeder');
//        $this->seed('MenuItemsTableSeeder');
        $this->seed('RolesTableSeeder');
        $this->seed('PermissionsTableSeeder');
        $this->seed('PermissionRoleTableSeeder');
        $this->seed('SettingsTableSeeder');
    }
}
