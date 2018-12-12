<?php

namespace App\Http\Controllers;

use App\Exceptions\ApiException;
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

        if (!is_null($request->query('address_id'))) {
            $address = $this->user()->addresses()->find($request->query('address_id'));
            if (is_null($address)) {
                throw ApiException::invalidAddressId();
            }
            $coordinate = $address->geo_location;
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

        $query = Restaurant::query($coordinate)
            ->distanceSphere('geo_location', $coordinate, '5000');
        $query = $this->filterQuery($query, $distanceFilter, 'distance');
        $query = $this->filterQuery($query, $deliveryTimeFilter, 'estimated_delivery_time');
        $query = $this->filterQuery($query, $deliveryFeeFilter, 'delivery_fee');
        $query = $this->filterQuery($query, $orderMinimumFilter, 'order_minimum');
        $query = $this->filterQuery($query, $ratingFilter, 'rating');
        if (!is_null($categories)) {
            $query->whereHas('restaurantCategories', function ($query) use ($categories) {
                $query->whereIn('id', $categories);
            });
        }
        if ($request->input('filter_open_only') === 'true') {
            $query = $query->having('is_open', true);
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
        if (is_null($orderBy)) {
            $orderBy = 'distance';
        }
        $query = $isDesc
            ? $query->orderByDesc($orderBy)
            : $query->orderBy($orderBy);

        $restaurants = $query->get();

        $categories = RestaurantCategory::all();

        return $this->response([
            'categories' => $categories,
            'restaurants' => $restaurants,
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
     * @throws \App\Exceptions\MapsException
     */
    public function show($id, Request $request)
    {
        $addressId = $request->query('address_id');
        $placeId = $request->query('place_id');
        if (!is_null($addressId)) {
            $address = $this->user()->addresses()->find($addressId);
            if (is_null($address)) {
                throw ApiException::invalidAddressId();
            }
            $coordinate = $address->geo_location;
        } elseif (!is_null($placeId)) {
            $coordinate = Maps::latLngByPlaceID($request->query('place_id'));
        } else {
            $coordinate = null;
        }
        $query = Restaurant::query($coordinate);
        if ($request->query('with_menu') === 'true') {
            $query = $query->with('restaurantMenu');
        }
        $restaurant = $query->find($id);
        if (is_null($restaurant)) {
            throw ApiException::resourceNotFound();
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
            $query = $query->having($param, '>=', $filter['min']);
        }
        if (!is_null($filter['max'])) {
            $query = $query->having($param, '<=', $filter['max']);
        }
        return $query;
    }
}
