<?php

namespace App\Facades;

use App\Exceptions\ApiException;
use App\Exceptions\MapsException;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Monolog\Logger;

class Maps
{
    /**
     * Make requests on Google Maps APIs
     *
     * @param string $method
     * @param string $uri
     * @param array $query [optional]
     * @return array
     *
     * @throws \App\Exceptions\MapsException
     * @throws \Exception
     */
    protected static function request(string $method, string $uri, array $query = [])
    {
        $client = new Client([
            'base_uri' => config('services.google_maps.base_uri'),
        ]);
        $query['key'] = config('services.google_maps.secret');
        try {
            $response = $client->request($method, $uri, [
                'query' => $query,
            ]);
        } catch (GuzzleException $exception) {
            throw new MapsException($exception->getMessage(), $exception->getCode(), $exception);
        }
        return json_decode($response->getBody()->getContents(), true);
    }

    /**
     * Get address from place ID
     *
     * @param string $placeId
     * @return array
     *
     * @throws \App\Exceptions\ApiException
     * @throws \App\Exceptions\MapsException
     * @throws \Exception
     */
    public static function reverseGeoCodingByPlaceID(string $placeId)
    {
        try {
            $response = self::request('GET', 'geocode/json', [
                'place_id' => $placeId,
            ]);
        } catch (MapsException $exception) {
            if ($exception->getCode() === 400) {
                throw ApiException::invalidPlaceId();
            }
            throw $exception;
        }
        if ($response['status'] !== 'OK') {
            throw new MapsException($response['status']);
        }
        return $response['results'];
    }

    /**
     * Get address components from GeoCoding result
     * 
     * @param array $geoCoding
     * @param bool $addressPrefix [optional]
     * @return array
     */
    public static function decodeResult(array $geoCoding, $addressPrefix = false) {
        $components = [];
        $streetNumber = null;
        $route = '';
        foreach ($geoCoding['address_components'] as $addressComponent) {
            foreach ($addressComponent['types'] as $type) {
                switch ($type) {
                    case 'street_number':
                        $streetNumber = $addressComponent['short_name'];
                        break 2;
                    case 'route':
                        $route = $addressComponent['short_name'];
                        break 2;
                    case 'locality':
                        $components['city'] = $addressComponent['short_name'];
                        break 2;
                    case 'administrative_area_level_1':
                        $components['state'] = $addressComponent['short_name'];
                        break 2;
                    case 'postal_code':
                        $components['zip_code'] = $addressComponent['short_name'];
                        break 2;
                }
            }
        }
        $components[$addressPrefix ? 'address_line_1' : 'line_1'] =
            $streetNumber === null ? $route : "${streetNumber} ${route}";
        $components['lat'] = $geoCoding['geometry']['location']['lat'];
        $components['lng'] = $geoCoding['geometry']['location']['lng'];
        return $components;
    }

    /**
     * Get latitude and longitude from place ID
     *
     * @param string $placeId
     * @return array
     *
     * @throws \App\Exceptions\ApiException
     * @throws \App\Exceptions\MapsException
     * @throws \Exception
     */
    public static function latLngByPlaceID(string $placeId)
    {
        $geoCoding = self::reverseGeoCodingByPlaceID($placeId);
        return [
            'lat' => $geoCoding[0]['geometry']['location']['lat'],
            'lng' => $geoCoding[0]['geometry']['location']['lng'],
        ];
    }

    /**
     * Reverse GeoCoding
     * 
     * @param double $lat
     * @param double $lng
     * @return array
     * 
     * @throws \App\Exceptions\ApiException
     * @throws \App\Exceptions\MpasException
     * @throws \Exception
     */
    public static function reverseGeoCodingByCoords($lat, $lng)
    {
        try {
            $response = self::request('GET', 'geocode/json', [
                'latlng' => "${lat},${lng}"
            ]);
        } catch (MapsException $exception) {
            if ($exception->getCode() === 400) {
                throw ApiException::zeroResult();
            }
            throw $exception;
        }
        if ($response['status'] !== 'OK') {
            throw new MapsException($response['status']);
        }
        return $response['results'];
    }
}
