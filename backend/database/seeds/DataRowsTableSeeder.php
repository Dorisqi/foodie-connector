<?php

use Illuminate\Database\Seeder;
use TCG\Voyager\Models\DataRow;
use TCG\Voyager\Models\DataType;

class DataRowsTableSeeder extends Seeder
{
    /**
     * Auto generated seed file.
     */
    public function run()
    {
        $userDataType = DataType::where('slug', 'users')->firstOrFail();
        $menuDataType = DataType::where('slug', 'menus')->firstOrFail();
        $roleDataType = DataType::where('slug', 'roles')->firstOrFail();
        $restaurantDataType = DataType::where('slug', 'restaurants')->firstOrFail();
        $restaurantCategoryDataType = DataType::where('slug', 'restaurant-categories')->firstOrFail();

        $dataRow = $this->dataRow($userDataType, 'id');
        if (!$dataRow->exists) {
            $dataRow->fill([
                'type'         => 'number',
                'display_name' => __('voyager::seeders.data_rows.id'),
                'required'     => 1,
                'browse'       => 0,
                'read'         => 0,
                'edit'         => 0,
                'add'          => 0,
                'delete'       => 0,
                'details'      => '',
                'order'        => 1,
            ])->save();
        }

        $dataRow = $this->dataRow($userDataType, 'name');
        if (!$dataRow->exists) {
            $dataRow->fill([
                'type'         => 'text',
                'display_name' => __('voyager::seeders.data_rows.name'),
                'required'     => 1,
                'browse'       => 1,
                'read'         => 1,
                'edit'         => 1,
                'add'          => 1,
                'delete'       => 1,
                'details'      => '',
                'order'        => 2,
            ])->save();
        }

        $dataRow = $this->dataRow($userDataType, 'email');
        if (!$dataRow->exists) {
            $dataRow->fill([
                'type'         => 'text',
                'display_name' => __('voyager::seeders.data_rows.email'),
                'required'     => 1,
                'browse'       => 1,
                'read'         => 1,
                'edit'         => 1,
                'add'          => 1,
                'delete'       => 1,
                'details'      => '',
                'order'        => 3,
            ])->save();
        }

        $dataRow = $this->dataRow($userDataType, 'password');
        if (!$dataRow->exists) {
            $dataRow->fill([
                'type'         => 'password',
                'display_name' => __('voyager::seeders.data_rows.password'),
                'required'     => 1,
                'browse'       => 0,
                'read'         => 0,
                'edit'         => 1,
                'add'          => 1,
                'delete'       => 0,
                'details'      => '',
                'order'        => 4,
            ])->save();
        }

        $dataRow = $this->dataRow($userDataType, 'remember_token');
        if (!$dataRow->exists) {
            $dataRow->fill([
                'type'         => 'text',
                'display_name' => __('voyager::seeders.data_rows.remember_token'),
                'required'     => 0,
                'browse'       => 0,
                'read'         => 0,
                'edit'         => 0,
                'add'          => 0,
                'delete'       => 0,
                'details'      => '',
                'order'        => 5,
            ])->save();
        }

        $dataRow = $this->dataRow($userDataType, 'created_at');
        if (!$dataRow->exists) {
            $dataRow->fill([
                'type'         => 'timestamp',
                'display_name' => __('voyager::seeders.data_rows.created_at'),
                'required'     => 0,
                'browse'       => 1,
                'read'         => 1,
                'edit'         => 0,
                'add'          => 0,
                'delete'       => 0,
                'details'      => '',
                'order'        => 6,
            ])->save();
        }

        $dataRow = $this->dataRow($userDataType, 'updated_at');
        if (!$dataRow->exists) {
            $dataRow->fill([
                'type'         => 'timestamp',
                'display_name' => __('voyager::seeders.data_rows.updated_at'),
                'required'     => 0,
                'browse'       => 0,
                'read'         => 0,
                'edit'         => 0,
                'add'          => 0,
                'delete'       => 0,
                'details'      => '',
                'order'        => 7,
            ])->save();
        }

        $dataRow = $this->dataRow($userDataType, 'avatar');
        if (!$dataRow->exists) {
            $dataRow->fill([
                'type'         => 'image',
                'display_name' => __('voyager::seeders.data_rows.avatar'),
                'required'     => 0,
                'browse'       => 1,
                'read'         => 1,
                'edit'         => 1,
                'add'          => 1,
                'delete'       => 1,
                'details'      => '',
                'order'        => 8,
            ])->save();
        }

        $dataRow = $this->dataRow($userDataType, 'user_belongsto_role_relationship');
        if (!$dataRow->exists) {
            $dataRow->fill([
                'type'         => 'relationship',
                'display_name' => __('voyager::seeders.data_rows.role'),
                'required'     => 0,
                'browse'       => 1,
                'read'         => 1,
                'edit'         => 1,
                'add'          => 1,
                'delete'       => 0,
                'details'      => '{"model":"TCG\\\Voyager\\\Models\\\Role","table":"roles","type":"belongsTo",'
                    . '"column":"role_id","key":"id","label":"display_name","pivot_table":"roles","pivot":"0"}',
                'order'        => 10,
            ])->save();
        }

        $dataRow = $this->dataRow($userDataType, 'user_belongstomany_role_relationship');
        if (!$dataRow->exists) {
            $dataRow->fill([
                'type'         => 'relationship',
                'display_name' => 'Roles',
                'required'     => 0,
                'browse'       => 1,
                'read'         => 1,
                'edit'         => 1,
                'add'          => 1,
                'delete'       => 0,
                'details'      => '{"model":"TCG\\\Voyager\\\Models\\\Role","table":"roles","type":"belongsToMany",'
                    . '"column":"id","key":"id","label":"display_name","pivot_table":"user_roles","pivot":"1",'
                    . '"taggable":"0"}',
                'order'        => 11,
            ])->save();
        }

        $dataRow = $this->dataRow($userDataType, 'locale');
        if (!$dataRow->exists) {
            $dataRow->fill([
                'type'         => 'text',
                'display_name' => 'Locale',
                'required'     => 0,
                'browse'       => 1,
                'read'         => 1,
                'edit'         => 1,
                'add'          => 1,
                'delete'       => 0,
                'details'      => '',
                'order'        => 12,
            ])->save();
        }

        $dataRow = $this->dataRow($userDataType, 'settings');
        if (!$dataRow->exists) {
            $dataRow->fill([
                'type'         => 'hidden',
                'display_name' => 'Settings',
                'required'     => 0,
                'browse'       => 0,
                'read'         => 0,
                'edit'         => 0,
                'add'          => 0,
                'delete'       => 0,
                'details'      => '',
                'order'        => 12,
            ])->save();
        }

        $dataRow = $this->dataRow($menuDataType, 'id');
        if (!$dataRow->exists) {
            $dataRow->fill([
                'type'         => 'number',
                'display_name' => __('voyager::seeders.data_rows.id'),
                'required'     => 1,
                'browse'       => 0,
                'read'         => 0,
                'edit'         => 0,
                'add'          => 0,
                'delete'       => 0,
                'details'      => '',
                'order'        => 1,
            ])->save();
        }

        $dataRow = $this->dataRow($menuDataType, 'name');
        if (!$dataRow->exists) {
            $dataRow->fill([
                'type'         => 'text',
                'display_name' => __('voyager::seeders.data_rows.name'),
                'required'     => 1,
                'browse'       => 1,
                'read'         => 1,
                'edit'         => 1,
                'add'          => 1,
                'delete'       => 1,
                'details'      => '',
                'order'        => 2,
            ])->save();
        }

        $dataRow = $this->dataRow($menuDataType, 'created_at');
        if (!$dataRow->exists) {
            $dataRow->fill([
                'type'         => 'timestamp',
                'display_name' => __('voyager::seeders.data_rows.created_at'),
                'required'     => 0,
                'browse'       => 0,
                'read'         => 0,
                'edit'         => 0,
                'add'          => 0,
                'delete'       => 0,
                'details'      => '',
                'order'        => 3,
            ])->save();
        }

        $dataRow = $this->dataRow($menuDataType, 'updated_at');
        if (!$dataRow->exists) {
            $dataRow->fill([
                'type'         => 'timestamp',
                'display_name' => __('voyager::seeders.data_rows.updated_at'),
                'required'     => 0,
                'browse'       => 0,
                'read'         => 0,
                'edit'         => 0,
                'add'          => 0,
                'delete'       => 0,
                'details'      => '',
                'order'        => 4,
            ])->save();
        }

        $dataRow = $this->dataRow($roleDataType, 'id');
        if (!$dataRow->exists) {
            $dataRow->fill([
                'type'         => 'number',
                'display_name' => __('voyager::seeders.data_rows.id'),
                'required'     => 1,
                'browse'       => 0,
                'read'         => 0,
                'edit'         => 0,
                'add'          => 0,
                'delete'       => 0,
                'details'      => '',
                'order'        => 1,
            ])->save();
        }

        $dataRow = $this->dataRow($roleDataType, 'name');
        if (!$dataRow->exists) {
            $dataRow->fill([
                'type'         => 'text',
                'display_name' => __('voyager::seeders.data_rows.name'),
                'required'     => 1,
                'browse'       => 1,
                'read'         => 1,
                'edit'         => 1,
                'add'          => 1,
                'delete'       => 1,
                'details'      => '',
                'order'        => 2,
            ])->save();
        }

        $dataRow = $this->dataRow($roleDataType, 'created_at');
        if (!$dataRow->exists) {
            $dataRow->fill([
                'type'         => 'timestamp',
                'display_name' => __('voyager::seeders.data_rows.created_at'),
                'required'     => 0,
                'browse'       => 0,
                'read'         => 0,
                'edit'         => 0,
                'add'          => 0,
                'delete'       => 0,
                'details'      => '',
                'order'        => 3,
            ])->save();
        }

        $dataRow = $this->dataRow($roleDataType, 'updated_at');
        if (!$dataRow->exists) {
            $dataRow->fill([
                'type'         => 'timestamp',
                'display_name' => __('voyager::seeders.data_rows.updated_at'),
                'required'     => 0,
                'browse'       => 0,
                'read'         => 0,
                'edit'         => 0,
                'add'          => 0,
                'delete'       => 0,
                'details'      => '',
                'order'        => 4,
            ])->save();
        }

        $dataRow = $this->dataRow($roleDataType, 'display_name');
        if (!$dataRow->exists) {
            $dataRow->fill([
                'type'         => 'text',
                'display_name' => __('voyager::seeders.data_rows.display_name'),
                'required'     => 1,
                'browse'       => 1,
                'read'         => 1,
                'edit'         => 1,
                'add'          => 1,
                'delete'       => 1,
                'details'      => '',
                'order'        => 5,
            ])->save();
        }

        $dataRow = $this->dataRow($userDataType, 'role_id');
        if (!$dataRow->exists) {
            $dataRow->fill([
                'type'         => 'text',
                'display_name' => __('voyager::seeders.data_rows.role'),
                'required'     => 1,
                'browse'       => 1,
                'read'         => 1,
                'edit'         => 1,
                'add'          => 1,
                'delete'       => 1,
                'details'      => '',
                'order'        => 9,
            ])->save();
        }

        // Restaurant
        $dataRow = $this->dataRow($restaurantDataType, 'id');
        $dataRow->fill([
            'type' => 'text',
            'display_name' => 'Id',
            'required' => 1,
            'browse' => 0,
            'read' => 0,
            'edit' => 0,
            'add' => 0,
            'delete' => 0,
            'order' => 1,
        ])->save();
        $dataRow = $this->dataRow($restaurantDataType, 'name');
        $dataRow->fill([
            'type' => 'text',
            'display_name' => 'Name',
            'required' => 1,
            'browse' => 1,
            'read' => 1,
            'edit' => 1,
            'add' => 1,
            'delete' => 1,
            'order' => 2,
        ])->save();
        $dataRow = $this->dataRow($restaurantDataType, 'order_minimum');
        $dataRow->fill([
            'type' => 'number',
            'display_name' => 'Order Minimum',
            'required' => 1,
            'browse' => 1,
            'read' => 1,
            'edit' => 1,
            'add' => 1,
            'delete' => 1,
            'order' => 3,
        ])->save();
        $dataRow = $this->dataRow($restaurantDataType, 'delivery_fee');
        $dataRow->fill([
            'type' => 'text',
            'display_name' => 'Delivery Fee',
            'required' => 1,
            'browse' => 1,
            'read' => 1,
            'edit' => 1,
            'add' => 1,
            'delete' => 1,
            'order' => 4,
        ])->save();
        $dataRow = $this->dataRow($restaurantDataType, 'rating');
        $dataRow->fill([
            'type' => 'text',
            'display_name' => 'Rating',
            'required' => 1,
            'browse' => 1,
            'read' => 1,
            'edit' => 1,
            'add' => 1,
            'delete' => 1,
            'order' => 5,
        ])->save();
        $dataRow = $this->dataRow($restaurantDataType, 'phone');
        $dataRow->fill([
            'type' => 'text',
            'display_name' => 'Phone',
            'required' => 1,
            'browse' => 0,
            'read' => 1,
            'edit' => 1,
            'add' => 1,
            'delete' => 1,
            'order' => 6,
        ])->save();
        $dataRow = $this->dataRow($restaurantDataType, 'address_line_1');
        $dataRow->fill([
            'type' => 'text',
            'display_name' => 'Address Line 1',
            'required' => 1,
            'browse' => 0,
            'read' => 1,
            'edit' => 1,
            'add' => 1,
            'delete' => 1,
            'order' => 7,
        ])->save();
        $dataRow = $this->dataRow($restaurantDataType, 'address_line_2');
        $dataRow->fill([
            'type' => 'text',
            'display_name' => 'Address Line 2',
            'required' => 0,
            'browse' => 0,
            'read' => 1,
            'edit' => 1,
            'add' => 1,
            'delete' => 1,
            'order' => 8,
        ])->save();
        $dataRow = $this->dataRow($restaurantDataType, 'city');
        $dataRow->fill([
            'type' => 'text',
            'display_name' => 'City',
            'required' => 1,
            'browse' => 1,
            'read' => 1,
            'edit' => 1,
            'add' => 1,
            'delete' => 1,
            'order' => 9,
        ])->save();
        $dataRow = $this->dataRow($restaurantDataType, 'state');
        $dataRow->fill([
            'type' => 'text',
            'display_name' => 'State',
            'required' => 1,
            'browse' => 0,
            'read' => 1,
            'edit' => 1,
            'add' => 1,
            'delete' => 1,
            'order' => 10,
        ])->save();
        $dataRow = $this->dataRow($restaurantDataType, 'zip_code');
        $dataRow->fill([
            'type' => 'text',
            'display_name' => 'Zip Code',
            'required' => 1,
            'browse' => 0,
            'read' => 1,
            'edit' => 1,
            'add' => 1,
            'delete' => 1,
            'order' => 11,
        ])->save();
        $dataRow = $this->dataRow($restaurantDataType, 'place_id');
        $dataRow->fill([
            'type' => 'text',
            'display_name' => 'Place ID',
            'required' => 1,
            'browse' => 0,
            'read' => 1,
            'edit' => 1,
            'add' => 1,
            'delete' => 1,
            'order' => 12,
        ])->save();
        $dataRow = $this->dataRow($restaurantDataType, 'lat');
        $dataRow->fill([
            'type' => 'number',
            'display_name' => 'Latitude',
            'required' => 1,
            'browse' => 0,
            'read' => 1,
            'edit' => 1,
            'add' => 1,
            'delete' => 1,
            'order' => 13,
        ])->save();
        $dataRow = $this->dataRow($restaurantDataType, 'lng');
        $dataRow->fill([
            'type' => 'number',
            'display_name' => 'Longitude',
            'required' => 1,
            'browse' => 0,
            'read' => 1,
            'edit' => 1,
            'add' => 1,
            'delete' => 1,
            'order' => 14,
        ])->save();
        $dataRow = $this->dataRow($restaurantDataType, 'restaurant_belongstomany_restaurant_category_relationship');
        $dataRow->fill([
            'type' => 'relationship',
            'display_name' => 'Categories',
            'required' => 0,
            'browse' => 1,
            'read' => 1,
            'edit' => 1,
            'add' => 1,
            'delete' => 1,
            'order' => 15,
            'details' => json_encode([
                'model' => 'App\\Models\\RestaurantCategory',
                'table' => 'restaurant_categories',
                'type' => 'belongsToMany',
                'column' => 'id',
                'key' => 'id',
                'label' => 'name',
                'pivot_table' => 'restaurant_restaurant_category',
                'pivot' => '1',
                'taggable' => '0'
            ]),
        ])->save();

        // Restaurant Category
        $dataRow = $this->dataRow($restaurantCategoryDataType, 'id');
        $dataRow->fill([
            'type' => 'text',
            'display_name' => 'Id',
            'required' => 1,
            'browse' => 0,
            'read' => 0,
            'edit' => 0,
            'add' => 0,
            'delete' => 0,
            'order' => 1,
        ])->save();
        $dataRow = $this->dataRow($restaurantCategoryDataType, 'name');
        $dataRow->fill([
            'type' => 'text',
            'display_name' => 'Name',
            'required' => 1,
            'browse' => 1,
            'read' => 1,
            'edit' => 1,
            'add' => 1,
            'delete' => 1,
            'order' => 1,
        ])->save();
    }

    /**
     * [dataRow description].
     *
     * @param [type] $type  [description]
     * @param [type] $field [description]
     *
     * @return [type] [description]
     */
    protected function dataRow($type, $field)
    {
        return DataRow::firstOrNew([
                'data_type_id' => $type->id,
                'field'        => $field,
            ]);
    }
}
