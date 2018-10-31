<?php

namespace App\Http\Controllers;

use App\Exceptions\ApiException;
use App\Facades\GeoLocation;
use App\Facades\Maps;
use App\Models\Restaurant;
use App\Models\RestaurantCategory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class RestaurantController extends ApiController
{
    /**
     * Get a list of restaurants
     *
     * @param \Illuminate\Http\Request
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \App\Exceptions\ApiException
     * @throws \App\Exceptions\MapsException
     */
    public function index(Request $request)
    {
        $coordinate = null;
        if (!is_null($request->query('address_id'))) {
            $address = $this->user()->addresses()->find($request->query('address_id'));
            if (is_null($address)) {
                throw ApiException::invalidAddressId();
            }
            $coordinate = $address;
        } elseif (!is_null($request->query('place_id'))) {
            $coordinate = Maps::latLngByPlaceID($request->query('place_id'));
        } else {
            throw ApiException::validationFailedErrors([
                'address_id' => [
                    'Must provide address_id or place_id.'
                ],
                'place_id' => [
                    'Must provide address_id or place_id.'
                ],
            ]);
        }

        $categories = null;
        if (!is_null($request->query('filter_categories'))) {
            $categories = explode('_', $request->query('filter_categories'));
            foreach ($categories as $category) {
                if (!ctype_digit($category)) {
                    throw ApiException::validationFailedErrors([
                        'filter_categories' => [
                            'The filter_categories must contain category ids separated by `_`.',
                        ],
                    ]);
                }
            }
        }

        $distanceFilter = $this->numericFilter($request, 'filter_distance');
        $deliveryTimeFilter = $this->numericFilter($request, 'filter_estimated_delivery_time');
        $deliveryFeeFilter = $this->numericFilter($request, 'filter_delivery_fee');
        $orderMinimumFilter = $this->numericFilter($request, 'filter_order_minimum');
        $ratingFilter = $this->numericFilter($request, 'filter_rating');

        $query = Restaurant::with([
            'restaurantCategories',
            'operationTimes' => function ($query) {
                $query->orderBy('day_of_week')->orderBy('start_time');
            },
        ]);
        $query = $this->filterQuery($query, $deliveryFeeFilter, 'delivery_fee');
        $query = $this->filterQuery($query, $orderMinimumFilter, 'order_minimum');
        $query = $this->filterQuery($query, $ratingFilter, 'rating');
        if (!is_null($categories)) {
            $query->whereHas('restaurantCategories', function ($query) use ($categories) {
                $query->whereIn('id', $categories);
            });
        }

        $orderBy = $request->query('order_by');
        $isDesc = false;
        if (is_null($orderBy) && !is_null($request->query('order_by_desc'))) {
            $orderBy = $request->query('order_by_desc');
            $isDesc = true;
        }
        if (!is_null($orderBy)) {
            switch ($orderBy) {
                case 'delivery_fee':
                case 'order_minimum':
                case 'rating':
                case 'distance':
                case 'estimated_delivery_time':
                    break;
                default:
                    $key = $isDesc ? 'order_by_desc' : 'order_by';
                    throw ApiException::validationFailedErrors([
                        $key => [
                            'The ' . $key .
                                ' must be delivery_fee, order_minimum, rating, distance, or estimated_delivery_time',
                        ],
                    ]);
            }
        }

        $restaurants = $query->get();
        $availableRestaurants = [];
        $filterOpenOnly = $request->input('filter_open_only') === 'true';
        foreach ($restaurants as $restaurant) {
            if ($filterOpenOnly && !$restaurant->is_open) {
                continue;
            }
            $restaurant->setAddress($coordinate);
            if (!$restaurant->is_deliverable) {
                continue;
            }
            if (!$this->filterAccepted($distanceFilter, $restaurant->distance)) {
                continue;
            }
            if (!$this->filterAccepted($deliveryTimeFilter, $restaurant->estimated_delivery_time)) {
                continue;
            }
            array_push($availableRestaurants, $restaurant->toArray());
        }

        if (is_null($orderBy)) {
            $orderBy = 'distance';
        }
        usort($availableRestaurants, function ($a, $b) use ($orderBy, $isDesc) {
            return $isDesc
                ? $b[$orderBy] <=> $a[$orderBy]
                : $a[$orderBy] <=> $b[$orderBy];
        });

        $categories = RestaurantCategory::all();

        return $this->response([
            'categories' => $categories,
            'restaurants' => $availableRestaurants,
        ]);
    }

    /**
     * Show a restaurant
     *
     * @param int $id
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \App\Exceptions\ApiException
     */
    public function show($id, Request $request)
    {
        $restaurant = Restaurant::with([
            'restaurantCategories',
            'operationTimes' => function ($query) {
                $query->orderBy('day_of_week')->orderBy('start_time');
            },
            'productCategories' => function ($query) {
                $query->orderBy('order');
            },
            'productCategories.products' => function ($query) {
                $query->orderBy('order');
            },
            'productCategories.products.productOptionGroups' => function ($query) {
                $query->orderBy('pivot_order');
            },
            'productCategories.products.productOptionGroups.productOptions' => function ($query) {
                $query->orderBy('order');
            },
        ])->find($id);
        if (is_null($restaurant)) {
            throw ApiException::resourceNotFound();
        }
        $address_id = $request->query('address_id');
        if (!is_null($address_id)) {
            $address = $this->user()->addresses()->find($address_id);
            if (is_null($address)) {
                throw ApiException::invalidAddressId();
            }
            $restaurant->setAddress($address);
        }
        return $this->response($restaurant);
    }

    /**
     * Get numeric filter range from query
     *
     * @param \Illuminate\Http\Request
     * @param string $param
     * @return array
     *
     * @throws \App\Exceptions\ApiException
     */
    protected function numericFilter(Request $request, string $param)
    {
        if (is_null($request->query($param))) {
            return null;
        }
        $values = explode('_', $request->query($param));
        if (count($values) != 2) {
            throw ApiException::validationFailedErrors([
                $param => 'The ' . $param . ' must be in the pattern [min]_[max].',
            ]);
        }
        if ((strlen($values[0]) > 0 && !is_numeric($values[0]))
            || (strlen($values[1] > 0 && !is_numeric($values[1])))) {
            throw ApiException::validationFailedErrors([
                $param => 'The ' . $param . ' must be numbers',
            ]);
        }
        return [
            'min' => strlen($values[0]) > 0 ? (double)$values[0] : null,
            'max' => strlen($values[1]) > 0 ? (double)$values[1] : null,
        ];
    }

    /**
     * Filter a number
     *
     * @param array|null $filter
     * @param int|double $number
     * @return bool
     */
    protected function filterAccepted($filter, $number)
    {
        if (is_null($filter)) {
            return true;
        }
        if (!is_null($filter['min']) && $number < $filter['min']) {
            return false;
        }
        if (!is_null($filter['max']) && $number > $filter['max']) {
            return false;
        }
        return true;
    }

    /**
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param array|null $filter
     * @param string $param
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function filterQuery(Builder $query, $filter, string $param)
    {
        if (is_null($filter)) {
            return $query;
        }
        if (!is_null($filter['min'])) {
            $query = $query->where($param, '>=', $filter['min']);
        }
        if (!is_null($filter['max'])) {
            $query = $query->where($param, '<=', $filter['max']);
        }
        return $query;
    }
}
