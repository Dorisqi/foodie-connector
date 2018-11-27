<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Models\OrderStatus;
use Illuminate\Console\Command;

class SetOrderStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'set:order-status {order} {status}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Set the status of an order';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function handle()
    {
        $orderId = $this->argument('order');
        $status = $this->argument('status');
        $order = Order::with('orderStatuses', 'orderMembers')->find($orderId);
        if (is_null($order)) {
            $this->error("Order '${orderId}' does not exists.");
            return;
        }
        if (!isset(OrderStatus::STATUS_IDS[$status])) {
            $this->error("Unknown status '${status}'.");
            return;
        }
        $order->updateStatus(OrderStatus::STATUS_IDS[$status]);
        $this->info('Order status updated successfully.');
    }
}
