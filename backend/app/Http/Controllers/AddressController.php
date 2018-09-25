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
        $user = Auth::user();
        $addresses = $user->addresses;
        foreach ($addresses as $key => $address) {
            $addresses[$key]['is_default'] = $address['id'] == $user['default_address'];
        }
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
            $user = Auth::user();
            $user->addresses()->save($address);
            if ($request->input('is_default') === true || is_null(Auth::user()->defaultAddress)) {
                $user['default_address'] = $address->id;
                $user->save();
                $address['is_default'] = true;
            } else {
                $address['is_default'] = false;
            }
            DB::commit();
        } catch (\Exception $exception) {
            DB::rollBack();
            throw $exception;
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
        $this->validateInput($request);

        try {
            DB::beginTransaction();

            $user = Auth::user();
            $address = Address::where('api_user_id', $user->getAuthIdentifier())->find($id);
            if (is_null($address)) {
                throw ApiException::resourceNotFound();
            }

            $address->fill($request->only($this->modelParams()));
            $address->save();

            if ($request->input('is_default') == true) {
                $user['default_address'] = $address->id;
                $user->save();
            }
            $address['is_default'] = $user['default_address'] == $address->id;

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
            $user = Auth::user();
            if ($user['default_address'] == $id) {
                $newDefaultAddress = $user->addresses()->where('id', '<>', $id)->first();
                if (is_null($newDefaultAddress)) {
                    $user['default_address'] = null;
                } else {
                    $user['default_address'] = $newDefaultAddress->id;
                }
                $user->save();
            }
            $deletedRows = Address::where('api_user_id', Auth::user()->getAuthIdentifier())
                ->where('id', $id)
                ->delete();
            if ($deletedRows == 0) {
                throw ApiException::resourceNotFound();
            }
            DB::commit();
        } catch (\Exception $exception) {
            DB::rollBack();
            throw $exception;
        }
        return $this->response([]);
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
