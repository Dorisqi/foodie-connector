<?php

namespace App\Http\Controllers;

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
        $addresses = Auth::user()->addresses;
        foreach ($addresses as $key => $address) {
            $addresses[$key]['is_default'] = $address['id'] == Auth::user()['default_address'];
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
        $this->validateInput($request);

        try {
            DB::beginTransaction();
            $address = new Address($request->only([
                'name', 'phone', 'line_1', 'line_2', 'city', 'state', 'zip_code', 'place_id'
            ]));
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
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        //
    }

    public static function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'phone' => 'required|phone:US',
            'line_1' => 'required|string|max:255',
            'line_2' => 'string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'zip_code' => 'required|zip_code',
            'place_id' => 'required|string|max:255',
            'is_default' => 'required|boolean'
        ];
    }
}
