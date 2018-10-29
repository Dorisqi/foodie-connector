<?php

if ($_SERVER['HTTP_AUTHORIZATION'] !== 'Bearer sk_test_gagC9svT5sqFffncVUpzhEQo') {
    header("HTTP/1.1 401 Unauthorized");
    exit;
}

$customerId = 'cus_Ds7X6iyihxJ5x3hHII';
$cardToken = 'tok_1DG9dQAv8osFAEU4RjLkEWvA';
$cardId = 'card_1DG9dQAv8osFAEU4IeXI2xtg';

header('Content-type: application/json');
if (($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/v1/customers')
    || ($_SERVER['REQUEST_METHOD'] === 'GET' && $_SERVER['REQUEST_URI'] === "/v1/customers/${customerId}")) {
    echo "
{
  \"id\": \"${customerId}\",
  \"object\": \"customer\",
  \"account_balance\": 0,
  \"created\": 1540767852,
  \"currency\": \"usd\",
  \"default_source\": null,
  \"delinquent\": false,
  \"description\": null,
  \"discount\": null,
  \"email\": null,
  \"invoice_prefix\": \"2558E68\",
  \"livemode\": false,
  \"metadata\": {
  },
  \"shipping\": null,
  \"sources\": {
    \"object\": \"list\",
    \"data\": [

    ],
    \"has_more\": false,
    \"total_count\": 0,
    \"url\": \"/v1/customers/${customerId}/sources\"
  },
  \"subscriptions\": {
    \"object\": \"list\",
    \"data\": [

    ],
    \"has_more\": false,
    \"total_count\": 0,
    \"url\": \"/v1/customers/${customerId}/subscriptions\"
  },
  \"tax_info\": null,
  \"tax_info_verification\": null
}
    ";
    exit;
}
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/v1/tokens') {
    echo "
{
  \"id\": \"${cardToken}\",
  \"object\": \"token\",
  \"card\": {
    \"id\": \"${cardId}\",
    \"object\": \"card\",
    \"address_city\": null,
    \"address_country\": null,
    \"address_line1\": null,
    \"address_line1_check\": null,
    \"address_line2\": null,
    \"address_state\": null,
    \"address_zip\": null,
    \"address_zip_check\": null,
    \"brand\": \"Visa\",
    \"country\": \"US\",
    \"cvc_check\": null,
    \"dynamic_last4\": null,
    \"exp_month\": 8,
    \"exp_year\": 2019,
    \"fingerprint\": \"xm3FwApIjmj2DL5K\",
    \"funding\": \"credit\",
    \"last4\": \"4242\",
    \"metadata\": {
    },
    \"name\": \"Jenny Rosen\",
    \"tokenization_method\": null
  },
  \"client_ip\": null,
  \"created\": 1538332036,
  \"livemode\": false,
  \"type\": \"card\",
  \"used\": false
}
    ";
    exit;
}
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === "/v1/customers/${customerId}/sources") {
    if ($_POST['source'] !== $cardToken) {
        header("HTTP/1.1 400 Bad Request");
        echo "
{
    \"error\": {
        \"message\": \"Bad request\",
        \"type\": \"invalid_request_error\"
    }
}
    ";
        exit;
    }
    echo "
{
    \"address_city\": null,
    \"address_country\": null,
    \"address_line1\": null,
    \"address_line1_check\": null,
    \"address_line2\": null,
    \"address_state\": null,
    \"address_zip\": \"47906\",
    \"address_zip_check\": null,
    \"brand\": \"Visa\",
    \"country\": \"US\",
    \"created\": 1540774011,
    \"customer\": \"${customerId}\",
    \"cvc_check\": \"pass\",
    \"dynamic_last4\": null,
    \"exp_month\": 12,
    \"exp_year\": 2030,
    \"fingerprint\": \"6PuAvAQt1dDgou5P\",
    \"funding\": \"credit\",
    \"id\": \"${cardId}\",
    \"last4\": \"4242\",
    \"livemode\": false,
    \"metadata\": {},
    \"name\": null,
    \"object\": \"card\",
    \"tokenization_method\": null,
    \"type\": \"card\"
}
";
    exit;
}
if (($_SERVER['REQUEST_METHOD'] === 'POST'
        || $_SERVER['REQUEST_METHOD'] === 'GET'
        || $_SERVER['REQUEST_METHOD'] === 'DELETE')
    && $_SERVER['REQUEST_URI'] === "/v1/customers/${customerId}/sources/${cardId}") {
    echo "
{
    \"address_city\": null,
    \"address_country\": null,
    \"address_line1\": null,
    \"address_line1_check\": null,
    \"address_line2\": null,
    \"address_state\": null,
    \"address_zip\": \"47906\",
    \"address_zip_check\": null,
    \"brand\": \"Visa\",
    \"country\": \"US\",
    \"created\": 1540774011,
    \"customer\": \"${customerId}\",
    \"cvc_check\": \"pass\",
    \"dynamic_last4\": null,
    \"exp_month\": 12,
    \"exp_year\": 2030,
    \"fingerprint\": \"6PuAvAQt1dDgou5P\",
    \"funding\": \"credit\",
    \"id\": \"${cardId}\",
    \"last4\": \"4242\",
    \"livemode\": false,
    \"metadata\": {},
    \"name\": null,
    \"object\": \"card\",
    \"tokenization_method\": null,
    \"type\": \"card\"
}
";
    exit;
}

error_log($_SERVER['REQUEST_METHOD']);
error_log($_SERVER['REQUEST_URI']);
header('HTTP/1.1 404 Not Found');
