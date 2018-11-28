<?php

namespace App\Http\Controllers\Admin;

use App\Models\Order;
use App\Models\OrderStatus;
use Illuminate\Http\Request;
use TCG\Voyager\Http\Controllers\VoyagerBaseController;

class OrderManageController extends VoyagerBaseController
{
    /**
     * Edit page
     *
     * @param \Illuminate\Http\Request $request
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function edit(Request $request, $id)
    {
        $order = Order
            ::with([
                'orderStatuses' => function ($query) {
                    $query->orderBy('time', 'desc');
                },
            ])
            ->addSelect(['*', Order::orderStatusQuery()])
            ->find($id);
        if (is_null($order)) {
            abort(404);
        }
        return response()
            ->view('admin/order-edit', [
                'order' => $order,
                'orderStatusNames' => OrderStatus::STATUS_NAMES,
            ]);
    }

    /**
     * Update order status
     *
     * @param $id
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function updateStatus($id, Request $request)
    {
        $order = Order::find($id);
        if (is_null($order)) {
            abort(404);
        }
        if (!isset(OrderStatus::STATUS_NAMES[$request->input('status')])) {
            abort(404);
        }
        $order->updateStatus($request->input('status'));
        $orderId = $order->id;
        return redirect("admin/orders/${orderId}/edit");
    }
}
