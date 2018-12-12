<?php

namespace App\Facades;

use App\Exceptions\ApiException;
use Grimzy\LaravelMysqlSpatial\Types\Point;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\Rule;

class Address
{
    /**
     * Migrate address information into database
     * This method is a old one (using decimal fields for geo_location)
     *
     * @param \Illuminate\Database\Schema\Blueprint $table
     * @return void
     */
    public static function oldMigrate(Blueprint $table)
    {
        $table->string('address_line_1');
        $table->string('address_line_2')->default('');
        $table->string('city');
        $table->string('state');
        $table->string('zip_code');
        $table->decimal('lat', 10, 8);
        $table->decimal('lng', 11, 8);
        $table->string('phone');
    }

    /**
     * Migrate to use point for geo_location
     *
     * @param string $table
     * @param string $model
     * @return void
     */
    public static function migrateToPoint($table, $model)
    {
        Schema::table($table, function (Blueprint $table) {
            $table->point('geo_location')->nullable()->after('lng');
        });
        $rows = call_user_func($model . '::all');
        foreach ($rows as $row) {
            $row->geo_location = new Point($row->lat, $row->lng);
            $row->save();
        }
        Schema::table($table, function (Blueprint $table) {
            $table->dropColumn('lat');
            $table->dropColumn('lng');
            $table->point('geo_location')->nullable(false)->change();
            $table->spatialIndex('geo_location');
        });
    }

    /**
     * Migrate back from point
     *
     * @param string $table
     * @param string $model
     * @return void
     */
    public static function migrateBackFromPoint($table, $model)
    {
        Schema::table($table, function (Blueprint $table) {
            $table->decimal('lat', 10, 8)->after('geo_location')->nullable();
            $table->decimal('lng', 11, 8)->after('lat')->nullable();
        });
        $rows = call_user_func($model . '::all');
        foreach ($rows as $row) {
            $row->lat = $row->geo_location->getLat();
            $row->lng = $row->geo_location->getLng();
            $row->save();
        }
        Schema::table($table, function (Blueprint $table) {
            $table->dropColumn('geo_location');
            $table->decimal('lat', 10, 8)->nullable(false)->change();
            $table->decimal('lng', 11, 8)->nullable(false)->change();
        });
    }

    /**
     * Return the validation rules for address
     *
     * @param bool $withPlaceId [optional]
     * @param bool $isRequired [optional]
     * @return array
     */
    public static function rules(bool $withPlaceId = true, bool $isRequired = true)
    {
        $rules = [];
        if ($withPlaceId) {
            $rules['place_id'] = 'string';
        }
        if ($isRequired) {
            $requiredRule = $withPlaceId ? 'required_without:place_id' : 'required';
        } else {
            $requiredRule = 'sometimes';
        }
        $rules['address_id'] = [
            $requiredRule,
            'integer',
        ];
        return $rules;
    }

    /**
     * Parse coordinate
     *
     * @param \Illuminate\Http\Request $request
     * @return \Grimzy\LaravelMysqlSpatial\Types\Point
     *
     * @throws \App\Exceptions\ApiException
     * @throws \App\Exceptions\MapsException
     */
    public static function parseCoords(Request $request)
    {
        if ($request->has('address_id')) {
            $address = Auth::guard('api')->user()->addresses()->find($request->query('address_id'));
            if (is_null($address)) {
                throw ApiException::invalidAddressId();
            }
            return $address->geo_location;
        } elseif ($request->has('place_id')) {
            return Maps::latLngByPlaceID($request->query('place_id'));
        }
        return null;
    }

    /**
     * Add address prefix to address line fields
     *
     * @param array $address
     * @return array
     */
    public static function addAddressPrefix(array $address)
    {
        return array_merge([
            'address_line_1' => $address['line_1'],
            'address_line_2' => $address['line_2'],
        ], array_only($address, ['city', 'state', 'zip_code', 'geo_location', 'phone']));
    }

    /**
     * Address fields
     *
     * @param bool $withPrefix [optional]
     * @return array
     */
    public static function addressFields(bool $withPrefix = true)
    {
        return [
            $withPrefix ? 'address_line_1' : 'line_1',
            $withPrefix ? 'address_line_2' : 'line_2',
            'city',
            'state',
            'zip_code',
            'geo_location',
            'phone',
        ];
    }
}
