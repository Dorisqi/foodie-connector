<?php

namespace App\Facades;

class GeoLocation
{
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
    /**
     * Return the distance (in KM) between two addresses
     *
     * @param array|object $address1
     * @param array|object $address2
     * @return float
     */
    public static function distance($address1, $address2)
    {
        if (is_array($address1)) {
            $lat1 = $address1['lat'];
            $lon1 = $address1['lng'];
        } else {
            $lat1 = $address1->lat;
            $lon1 = $address1->lng;
        }
        if (is_array($address2)) {
            $lat2 = $address2['lat'];
            $lon2 = $address2['lng'];
        } else {
            $lat2 = $address2->lat;
            $lon2 = $address2->lng;
        }

        $theta = $lon1 - $lon2;
        $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2))
            +  cos(deg2rad($lat1)) * cos(deg2rad($lat2))
            * cos(deg2rad($theta));
        $dist = acos($dist);
        $dist = rad2deg($dist);
        return $dist * 111.18957696; // 60 * 1.1515 * 1.609344
    }
}
