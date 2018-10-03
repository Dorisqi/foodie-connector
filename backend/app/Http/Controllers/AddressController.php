<?php

namespace App\Http\Controllers;

use App\Exceptions\ApiException;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        $user = $this->user();
        $addresses = $user->addresses;
        return $this->response($addresses);
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
            $address = new Address($request->only($this->modelParams()));
            $user = $this->user();
            $user->addresses()->save($address);
            if ($request->input('is_default') === true
                || is_null($user->defaultAddress)) {
                $address->is_default = true;
            }
            DB::commit();
        } catch (\Exception $exception) {
            DB::rollBack();
            throw $exception;
        }

        return $this->response($address);
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

            $address->fill($request->only($this->modelParams()));
            $address->save();
            if ($request->input('is_default') == true) {
                $address->is_default = true;
            }

            DB::commit();
        } catch (\Exception $exception) {
            DB::rollBack();
            throw $exception;
        }

        return $address;
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
                if (is_null($newDefaultAddress)) {
                    $user->default_address_id = null;
                    $user->save();
                } else {
                    $newDefaultAddress->is_default = true;
                }
            }
            $address->delete();
            DB::commit();
        } catch (\Exception $exception) {
            DB::rollBack();
            throw $exception;
        }
        return $this->response();
    }

    /**
     * Get params for model
     *
     * @return array
     */
    protected function modelParams()
    {
        return [
            'name', 'phone', 'line_1', 'line_2', 'city', 'state', 'zip_code', 'place_id'
        ];
    }

    public static function rules()
    {
        return [
            'name' => 'string|max:255',
            'phone' => 'phone:US',
            'line_1' => 'string|max:255',
            'line_2' => 'string|max:255',
            'city' => 'string|max:255',
            'state' => 'string|max:255',
            'zip_code' => 'zip_code',
            'place_id' => 'string|max:255',
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
}
