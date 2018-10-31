<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;

class GenerateRestaurantData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'generate:restaurant-data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate restaurant seeder data';

    /**
     * API token for requesting restaurant raw data
     *
     * @var string
     */
    protected $apiToken = null;

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
     * Download url to local file
     *
     * @param string $uri
     * @param string $filePath
     * @param callback|null $needDownload [optional]
     * @return void
     */
    protected function download(string $uri, string $filePath, $needDownload = null)
    {
        if (file_exists($filePath)) {
            return;
        }
        $headers = $needDownload();
        sleep(1);
        try {
            $file = fopen($filePath, 'w');
            $ch = curl_init($uri);
            curl_setopt($ch, CURLOPT_FILE, $file);
            if (!is_null($headers)) {
                curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            }
            curl_exec($ch);
            curl_close($ch);
            fclose($file);
        } catch (\Exception $e) {
            if (isset($ch) && !is_null($ch)) {
                curl_close($ch);
            }
            if (isset($file) && !is_null($file)) {
                fclose($file);
            }
            unlink($filePath);
            $this->error("Failed to download");
            $this->error("  uri: ${uri}");
            $this->error("  filePath: ${filePath}");
        }
    }

    /**
     * Return headers for API request
     *
     * @return array
     */
    protected function apiHeaders()
    {
        if (is_null($this->apiToken)) {
            $this->apiToken = $this->ask('API Token?');
        }
        return [
            'Authorization: Bearer ' . $this->apiToken,
        ];
    }

    /**
     * Price to decimal
     *
     * @param int $price
     * @return double
     */
    protected function priceToDecimal(int $price)
    {
        return (double)$price / 100;
    }

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function handle()
    {
        $dataPath = base_path('database/seeds/data/restaurants');
        $listData = json_decode(file_get_contents("${dataPath}/raw/restaurant-list.json"), true);
        $categories = [];
        $restaurants = [];
        foreach ($listData['results'] as $restaurantData) {
            if ($restaurantData['name'] === 'Taco Bell') {
                continue;
            }
            $id = $restaurantData['restaurant_id'];
            $this->info($id
                . ' - '
                . $restaurantData['name']);
            $imageFileName = $restaurantData['media_image']['public_id']
                . '.'
                . $restaurantData['media_image']['format'];
            $restaurant = [
                'grubhub_id' => $id,
                'name' => $restaurantData['name'],
                'categories' => $restaurantData['cuisines'],
                'phone' => $restaurantData['phone_number']['phone_number'],
                'rating' => $restaurantData['ratings']['actual_rating_value'],
                'address_line_1' => $restaurantData['address']['street_address'],
                'city' => $restaurantData['address']['address_locality'],
                'state' => $restaurantData['address']['address_region'],
                'zip_code' => $restaurantData['address']['postal_code'],
                'lat' => $restaurantData['address']['latitude'],
                'lng' => $restaurantData['address']['longitude'],
                'order_minimum' => $this->priceToDecimal($restaurantData['delivery_minimum']['price']),
                'delivery_fee' => $this->priceToDecimal($restaurantData['delivery_fee']['price']),
                'image' => $imageFileName,
                'available_hours' => [],
            ];
            foreach ($restaurantData['cuisines'] as $cuisine) {
                $categories[$cuisine] = true;
            }

            $filePath = "${dataPath}/raw/restaurant-${id}.json";
            $this->download(
                'https://api-gtm.grubhub.com/restaurants/'
                . $id
                . '?hideChoiceCategories=false&variationId=otter&orderType=standard&hideUnavailableMenuItems=true'
                . '&hideMenuItems=false&showMenuItemCoupons=true&includePromos=true'
                . '&location=POINT(-86.909089+40.422758)',
                $filePath,
                function () {
                    return $this->apiHeaders();
                }
            );

            $restaurantDetail = json_decode(file_get_contents($filePath), true);
            foreach ($restaurantDetail['restaurant_availability']['available_hours'] as $available_hour) {
                foreach ($available_hour['time_ranges'] as $time_range) {
                    if ($time_range === 'CLOSED') {
                        continue;
                    }
                    $times = explode('-', $time_range);
                    array_push($restaurant['available_hours'], [
                        'day_of_week' => $available_hour['day_of_week'],
                        'start_time' => Carbon::parse($times[0])->subHours(3)->toTimeString(),
                        'end_time' => Carbon::parse($times[1])->subHours(3)->toTimeString(),
                    ]);
                }
            }

            array_push($restaurants, $restaurant);

            // Parse menu
            $menuCategories = [];
            $optionGroups = [];
            foreach ($restaurantDetail['restaurant']['menu_category_list'] as $menuCategory) {
                $category = [
                    'name' => $menuCategory['name'],
                    'order' => $menuCategory['sequence'],
                    'items' => [],
                ];
                foreach ($menuCategory['menu_item_list'] as $menuItem) {
                    $item = [
                        'name' => $menuItem['name'],
                        'description' => $menuItem['description'],
                        'price' => $this->priceToDecimal($menuItem['price']['amount']),
                        'minimum_price' => $this->priceToDecimal($menuItem['minimum_price_variation']['amount']),
                        'maximum_price' => $this->priceToDecimal($menuItem['maximum_price_variation']['amount']),
                        'order' => $menuItem['sequence'],
                        'optionGroups' => [],
                    ];
                    foreach ($menuItem['choice_category_list'] as $choiceCategory) {
                        if (!isset($optionGroups[$choiceCategory['id']])) {
                            $optionGroup = [
                                'name' => $choiceCategory['name'],
                                'min_choice' => $choiceCategory['min_choice_options'],
                                'max_choice' => $choiceCategory['max_choice_options'] ?? null,
                                'options' => [],
                            ];
                            foreach ($choiceCategory['choice_option_list'] as $choiceOption) {
                                array_push($optionGroup['options'], [
                                    'name' => $choiceOption['description'],
                                    'price' => $this->priceToDecimal($choiceOption['price']['amount']),
                                    'order' => $choiceOption['sequence'],
                                ]);
                            }
                            $optionGroups[$choiceCategory['id']] = $optionGroup;
                        }
                        array_push($item['optionGroups'], [
                            'grubhub_id' => $choiceCategory['id'],
                            'order' => $choiceCategory['sequence'],
                        ]);
                    }
                    array_push($category['items'], $item);
                }
                array_push($menuCategories, $category);
            }

            $menu = [
                'categories' => $menuCategories,
                'optionGroups' => $optionGroups,
            ];
            file_put_contents("${dataPath}/menu-${id}.json", json_encode($menu));

            $this->download(
                $restaurantData['media_image']['base_url'] . $imageFileName,
                "${dataPath}/images/${imageFileName}",
                function () {
                    $this->info('Downloading Image');
                    return null;
                }
            );
        }

        file_put_contents("${dataPath}/restaurants.json", json_encode($restaurants));
        $categoryKeys = array_keys($categories);
        sort($categoryKeys);
        file_put_contents("${dataPath}/categories.json", json_encode($categoryKeys));
    }
}
