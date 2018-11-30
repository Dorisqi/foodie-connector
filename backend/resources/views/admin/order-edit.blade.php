@extends('voyager::master')

@section('css')
    <meta name="csrf-token" content="{{ csrf_token() }}">
@stop

@section('page_title', 'Edit Order ' . $order->id)

@section('page_header')
    <h1 class="page-title">
        <i class="voyager-logbook"></i>
        Edit Order {{ $order->id }}
    </h1>
    @include('voyager::multilingual.language-selector')
@stop

@section('content')
    <div class="page-content edit-add container-fluid">
        <div class="row">
            <div class="col-md-12">
                <div class="panel panel-bordered">
                    <div class="panel-body">
                        <div class="form-group">
                            Order Status: {{ $orderStatusNames[$order->order_status] }}
                        </div>
                        <div class="form-group">
                            Status History
                            @foreach($order->orderStatuses as $orderStatus)
                                <div>
                                    {{ $orderStatusNames[$orderStatus->status] }} at {{ $orderStatus->time }}
                                </div>
                            @endforeach
                        </div>
                        @foreach ($orderStatusNames as $statusId => $orderStatusName)
                            <div class="form-group">
                                <form method="post">
                                    {{ csrf_field() }}
                                    <input type="hidden" name="status" value="{{$statusId}}" />
                                    <button type="submit" class="btn btn-primary">
                                        Set as {{ $orderStatusName }}
                                    </button>
                                </form>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
        </div>
    </div>
@stop
