<?php

namespace App\Http\Controllers;

use App\Exceptions\ApiException;
use App\Facades\Maps;
use App\Models\Address;
use App\Models\Admin\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AddressController extends ApiController
{
    /**
     * Get a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        return $this->response($this->user()->addresses()->get());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \App\Exceptions\ApiException
     * @throws \Exception
     */
    public function store(Request $request)
    {
        $this->validateInput($request, $this::storeRules());

        try {
            DB::beginTransaction();

            if ($request['line_2'] === null) {
                $request['line_2'] = '';
            }
            $addressArray = $request->only($this->modelParams());
            $addressArray = array_merge(
                $addressArray,
                Maps::decodeResult(Maps::reverseGeoCodingByPlaceID($request->input('place_id'))[0])
            );
            $address = new Address($addressArray);
            $user = $this->user();
            $user->addresses()->save($address);
            if ($request->input('is_default') === true
                || is_null($user->default_address_id)) {
                $address->is_default = true;
            }

            DB::commit();
        } catch (\Exception $exception) {
            DB::rollBack();
            throw $exception;
        }

        return $this->response($this->user()->addresses()->get());
    }

    /**
     * Show the specific resource
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \App\Exceptions\ApiException
     */
    public function show($id)
    {
        $address = $this->user()->addresses()->find($id);
        if (is_null($address)) {
            throw ApiException::resourceNotFound();
        }
        return $this->response($address);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \App\Exceptions\ApiException
     * @throws \Exception
     */
    public function update(Request $request, $id)
    {
        $address = $this->user()->addresses()->find($id);
        if (is_null($address)) {
            throw ApiException::resourceNotFound();
        }

        $this->validateInput($request);

        try {
            DB::beginTransaction();

            $addressArray = $request->only($this->modelParams());
            if ($request->has('place_id')) {
                $addressArray = array_merge(
                    $addressArray,
                    Maps::decodeResult(Maps::reverseGeoCodingByPlaceID($request->input('place_id'))[0])
                );
            }
            $address->fill($addressArray);
            $address->save();
            if ($request->input('is_default') == true) {
                $address->is_default = true;
            }

            DB::commit();
        } catch (\Exception $exception) {
            DB::rollBack();
            throw $exception;
        }

        return $this->response($this->user()->addresses()->get());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \Exception
     */
    public function destroy($id)
    {
        try {
            DB::beginTransaction();
            $user = $this->user();
            $address = $user->addresses()->find($id);
            if (is_null($address)) {
                throw ApiException::resourceNotFound();
            }
            if ($address->is_default) {
                $newDefaultAddress = $user->addresses()->where('id', '<>', $id)->orderByDesc('id')->first();
                if (!is_null($newDefaultAddress)) {
                    $newDefaultAddress->is_default = true;
                }
            }
            $address->delete();
            DB::commit();
        } catch (\Exception $exception) {
            DB::rollBack();
            throw $exception;
        }
        return $this->response($this->user()->addresses()->get());
    }

    /**
     * Reverse GeoCoding
     * 
     * @param \Illuminate\Http\Request
     * @return \Illuminate\Http\JsonResponse
     * 
     * @throws \App\Exceptions\ApiException
     */
    public function reverseGeoCodingByCoords(Request $request)
    {
        $this->validateInput($request, $this::reverseGeoCodingRules());
        return $this->response(
            Maps::reverseGeoCodingByCoords(
                $request->input('lat'),
                $request->input('lng')
            )[0]
        );
    }

    /**
     * Get params for model
     *
     * @return array
     */
    protected function modelParams()
    {
        return [
            'name', 'phone', 'line_2', 'place_id'
        ];
    }

    public static function rules()
    {
        return [
            'place_id' => 'string|max:255',
            'line_2' => 'nullable|string|max:255',
            'name' => 'string|max:255',
            'phone' => 'phone:US',
            'is_default' => 'boolean'
        ];
    }

    public static function storeRules()
    {
        $rules = self::rules();
        foreach ($rules as $key => $rule) {
            if ($key === 'line_2') {
                continue;
            }
            $rules[$key] .= '|required';
        }
        return $rules;
    }

    public static function reverseGeoCodingRules()
    {
        return [
            'lat' => 'required|numeric',
            'lng' => 'required|numeric',
        ];
    }
}
