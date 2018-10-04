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
        $coordinate = null;
        if (!is_null($request->query('address_id'))) {
            $address = $this->user()->addresses()->find($request->query('address_id'));
            if (is_null($address)) {
                throw ApiException::invalidAddressId();
            }
            $coordinate = [
                'lat' => $address->lat,
                'lng' => $address->lng,
            ];
        } elseif (!is_null($request->query('place_id'))) {
            $address = Maps::reverseGeoCodingByPlaceID($request->query('place_id'));
            $location = $address[0]->{'geometry'}->{'location'};
            $coordinate = [
                'lat' => $location->{'lat'},
                'lng' => $location->{'lng'},
            ];
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

        $query = Restaurant::with('address', 'restaurantCategories');
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
                    if ($isDesc) {
                        $query = $query->orderByDesc($orderBy);
                    } else {
                        $query = $query->orderBy($orderBy);
                    }
                    break;
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
        foreach ($restaurants as $restaurant) {
            // TODO: operation hours
            // TODO: change to polygon
            $distance = $this->distance(
                $coordinate['lat'],
                $coordinate['lng'],
                $restaurant->address->lat,
                $restaurant->address->lng,
                'M'
            );
            if ($distance > 5) {
                continue;
            }
            if (!$this->filterAccepted($distanceFilter, $distance)) {
                continue;
            }
            $estimatedDeliveryTime = (int)(20 + $distance * 3); // TODO: A better calculation of delivery time
            if (!$this->filterAccepted($deliveryTimeFilter, $estimatedDeliveryTime)) {
                continue;
            }
            $restaurantArray = $restaurant->toArray();
            $restaurantArray['distance'] = round($distance, 1);
            $restaurantArray['estimated_delivery_time'] = (int)(20 + $distance * 3);
            array_push($availableRestaurants, $restaurantArray);
        }

        if (is_null($orderBy) || $orderBy === 'distance') {
            usort($availableRestaurants, function ($a, $b) use ($isDesc) {
                return $isDesc
                    ? $b['distance'] <=> $a['distance']
                    : $a['distance'] <=> $b['distance'];
            });
        } elseif ($orderBy === 'estimated_delivery_time') {
            usort($availableRestaurants, function ($a, $b) use ($isDesc) {
                return $isDesc
                    ? $b['estimated_delivery_time'] <=> $a['estimated_delivery_time']
                    : $a['estimated_delivery_time'] <=> $b['estimated_delivery_time'];
            });
        }

        $categories = RestaurantCategory::all();

        return $this->response([
            'categories' => $categories,
            'restaurants' => $availableRestaurants,
        ]);
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

    /*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    /*::                                                                         :*/
    /*::  This routine calculates the distance between two points (given the     :*/
    /*::  lat/lng of those points). It is being used to calculate     :*/
    /*::  the distance between two locations using GeoDataSource(TM) Products    :*/
    /*::                                                                         :*/
    /*::  Definitions:                                                           :*/
    /*::    South lats are negative, east lngs are positive           :*/
    /*::                                                                         :*/
    /*::  Passed to function:                                                    :*/
    /*::    lat1, lon1 = lat and lng of point 1 (in decimal degrees)  :*/
    /*::    lat2, lon2 = lat and lng of point 2 (in decimal degrees)  :*/
    /*::    unit = the unit you desire for results                               :*/
    /*::           where: 'M' is statute miles (default)                         :*/
    /*::                  'K' is kilometers                                      :*/
    /*::                  'N' is nautical miles                                  :*/
    /*::  Worldwide cities and other features databases with lat lng  :*/
    /*::  are available at https://www.geodatasource.com                         :*/
    /*::                                                                         :*/
    /*::  For enquiries, please contact sales@geodatasource.com                  :*/
    /*::                                                                         :*/
    /*::  Official Web site: https://www.geodatasource.com                       :*/
    /*::                                                                         :*/
    /*::         GeoDataSource.com (C) All Rights Reserved 2017                  :*/
    /*::                                                                         :*/
    /*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    protected function distance($lat1, $lon1, $lat2, $lon2, $unit)
    {

        $theta = $lon1 - $lon2;
        $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2))
            +  cos(deg2rad($lat1)) * cos(deg2rad($lat2))
            * cos(deg2rad($theta));
        $dist = acos($dist);
        $dist = rad2deg($dist);
        $miles = $dist * 60 * 1.1515;
        $unit = strtoupper($unit);

        if ($unit == "K") {
            return ($miles * 1.609344);
        } elseif ($unit == "N") {
            return ($miles * 0.8684);
        } else {
            return $miles;
        }
    }
}
