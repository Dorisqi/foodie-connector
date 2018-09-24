# Foodie Connector API Doc

Generated at {{ date('Y-m-d H:i:s') }}

@foreach ($tags as $name => $tag)
## **{{ $name }}**

{{ $tag['description'] }}

@foreach ($tag['apis'] as $api)
### **{{ $api['method'] }} - {{ $api['uri'] }}**

{{ $api['summary'] }}

@foreach ($api['requests'] as $request)
#### Status Code: {{ $request['status_code'] }}

{{ $request['description'] }}

Request:
```
{!! $request['request'] !!}
```

Response:
```
{!! $request['response'] !!}
```
@endforeach

@endforeach
@endforeach
