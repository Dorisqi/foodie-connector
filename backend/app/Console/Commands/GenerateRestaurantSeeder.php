<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class GenerateRestaurantSeeder extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'generate:restaurant-seeder';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate restaurant seeder data';

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
        $dataPath = 'database/seeds/data/restaurants/';
        $rawFiles = scandir(base_path($dataPath . 'raw'));
        $businesses = [];
        $ids = [];
        $categories = [];
        if (!file_exists(base_path($dataPath . 'images'))) {
            mkdir(base_path($dataPath . 'images'));
        }
        foreach ($rawFiles as $rawFile) {
            if (!preg_match("/\.json$/", $rawFile)) {
                continue;
            }
            $data = json_decode(file_get_contents(base_path($dataPath . 'raw/' . $rawFile)));
            $businessesData = $data->{'businesses'};
            foreach ($businessesData as $businessData) {
                $id = $businessData->{'id'};
                if (array_key_exists($id, $ids)) {
                    continue;
                }
                $ids[$id] = true;
                $locationData = $businessData->{'location'};
                $business = [
                    'yelp_id' => $id,
                    'name' => $businessData->{'name'},
                    'categories' => [],
                    'phone' => $businessData->{'phone'},
                    'rating' => $businessData->{'rating'},
                    'address_line_1' => $locationData->{'address1'},
                    'address_line_2' => $locationData->{'address2'},
                    'city' => $locationData->{'city'},
                    'state' => $locationData->{'state'},
                    'zip_code' => $locationData->{'zip_code'},
                    'lat' => $businessData->{'coordinates'}->{'latitude'},
                    'lng' => $businessData->{'coordinates'}->{'longitude'},
                    'order_minimum' => 10 + strlen($businessData->{'price'}) * 5,
                    'delivery_fee' => min(1 + round($businessData->{'distance'} / 500) * 0.5, 4) - 0.01,
                ];
                foreach ($businessData->{'categories'} as $categoryData) {
                    $category = $categoryData->{'title'};
                    $categories[$category] = true;
                    array_push($business['categories'], $category);
                }
                array_push($businesses, $business);

                // Download image
                if (!file_exists(base_path($dataPath . 'images/' . $id . '.jpg'))) {
                    $imageFile = fopen(base_path($dataPath . 'images/' . $id . '.jpg'), 'w');
                    $ch = curl_init($businessData->{'image_url'});
                    curl_setopt($ch, CURLOPT_FILE, $imageFile);
                    curl_exec($ch);
                    curl_close($ch);
                    fclose($imageFile);
                    sleep(1);
                }
            }
        }

        file_put_contents(base_path($dataPath . 'restaurants.json'), json_encode($businesses));
        $categoryKeys = array_keys($categories);
        sort($categoryKeys);
        file_put_contents(base_path($dataPath . 'categories.json'), json_encode($categoryKeys));
    }
}
