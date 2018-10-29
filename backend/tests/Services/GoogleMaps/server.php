<?php

const API_KEY = 'AEFKjh3e2q389adjkh32qASD';
if ($_GET['key'] !== API_KEY) {
    header('HTTP/1.1 401 Unauthorized');
    exit;
}

header('Content-Type: application/json; charset=UTF-8');
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_SERVER['PHP_SELF'] === '/geocode/json') {
    switch ($_GET['place_id']) {
        case 'ChIJO_0IEK_iEogR4GrIyYopzz8':
            echo "
{
   \"results\" : [
      {
         \"address_components\" : [
            {
               \"long_name\" : \"134\",
               \"short_name\" : \"134\",
               \"types\" : [ \"street_number\" ]
            },
            {
               \"long_name\" : \"Pierce Street\",
               \"short_name\" : \"Pierce St\",
               \"types\" : [ \"route\" ]
            },
            {
               \"long_name\" : \"West Lafayette\",
               \"short_name\" : \"West Lafayette\",
               \"types\" : [ \"locality\", \"political\" ]
            },
            {
               \"long_name\" : \"Wabash Township\",
               \"short_name\" : \"Wabash Township\",
               \"types\" : [ \"administrative_area_level_3\", \"political\" ]
            },
            {
               \"long_name\" : \"Tippecanoe County\",
               \"short_name\" : \"Tippecanoe County\",
               \"types\" : [ \"administrative_area_level_2\", \"political\" ]
            },
            {
               \"long_name\" : \"Indiana\",
               \"short_name\" : \"IN\",
               \"types\" : [ \"administrative_area_level_1\", \"political\" ]
            },
            {
               \"long_name\" : \"United States\",
               \"short_name\" : \"US\",
               \"types\" : [ \"country\", \"political\" ]
            },
            {
               \"long_name\" : \"47906\",
               \"short_name\" : \"47906\",
               \"types\" : [ \"postal_code\" ]
            }
         ],
         \"formatted_address\" : \"134 Pierce St, West Lafayette, IN 47906, USA\",
         \"geometry\" : {
            \"location\" : {
               \"lat\" : 40.4227584,
               \"lng\" : -86.9090892
            },
            \"location_type\" : \"ROOFTOP\",
            \"viewport\" : {
               \"northeast\" : {
                  \"lat\" : 40.4241073802915,
                  \"lng\" : -86.90774021970849
               },
               \"southwest\" : {
                  \"lat\" : 40.4214094197085,
                  \"lng\" : -86.91043818029151
               }
            }
         },
         \"place_id\" : \"ChIJO_0IEK_iEogR4GrIyYopzz8\",
         \"types\" : [ \"street_address\" ]
      }
   ],
   \"status\" : \"OK\"
}
";
            break;
        case 'ChIJPbVda67iEogRTWzmvivderE':
            echo "
{
   \"results\" : [
      {
         \"address_components\" : [
            {
               \"long_name\" : \"Purdue Memorial Union\",
               \"short_name\" : \"Purdue Memorial Union\",
               \"types\" : [ \"premise\" ]
            },
            {
               \"long_name\" : \"Wabash Township\",
               \"short_name\" : \"Wabash Township\",
               \"types\" : [ \"administrative_area_level_3\", \"political\" ]
            },
            {
               \"long_name\" : \"Tippecanoe County\",
               \"short_name\" : \"Tippecanoe County\",
               \"types\" : [ \"administrative_area_level_2\", \"political\" ]
            },
            {
               \"long_name\" : \"Indiana\",
               \"short_name\" : \"IN\",
               \"types\" : [ \"administrative_area_level_1\", \"political\" ]
            },
            {
               \"long_name\" : \"United States\",
               \"short_name\" : \"US\",
               \"types\" : [ \"country\", \"political\" ]
            },
            {
               \"long_name\" : \"47907\",
               \"short_name\" : \"47907\",
               \"types\" : [ \"postal_code\" ]
            }
         ],
         \"formatted_address\" : \"Purdue Memorial Union, Wabash Township, IN 47907, USA\",
         \"geometry\" : {
            \"location\" : {
               \"lat\" : 40.4248,
               \"lng\" : -86.911
            },
            \"location_type\" : \"ROOFTOP\",
            \"viewport\" : {
               \"northeast\" : {
                  \"lat\" : 40.42614898029149,
                  \"lng\" : -86.90965101970849
               },
               \"southwest\" : {
                  \"lat\" : 40.42345101970849,
                  \"lng\" : -86.9123489802915
               }
            }
         },
         \"place_id\" : \"ChIJPbVda67iEogRTWzmvivderE\",
         \"types\" : [ \"premise\" ]
      }
   ],
   \"status\" : \"OK\"
}
";
            break;
        case 'ChIJP5iLHkCuEmsRwMwyFmh9AQU':
            echo "
{
   \"results\" : [
      {
         \"address_components\" : [
            {
               \"long_name\" : \"Sydney\",
               \"short_name\" : \"Sydney\",
               \"types\" : [ \"locality\", \"political\" ]
            },
            {
               \"long_name\" : \"New South Wales\",
               \"short_name\" : \"NSW\",
               \"types\" : [ \"administrative_area_level_1\", \"political\" ]
            },
            {
               \"long_name\" : \"Australia\",
               \"short_name\" : \"AU\",
               \"types\" : [ \"country\", \"political\" ]
            },
            {
               \"long_name\" : \"2000\",
               \"short_name\" : \"2000\",
               \"types\" : [ \"postal_code\" ]
            }
         ],
         \"formatted_address\" : \"Sydney NSW 2000, Australia\",
         \"geometry\" : {
            \"bounds\" : {
               \"northeast\" : {
                  \"lat\" : -33.8561088,
                  \"lng\" : 151.222951
               },
               \"southwest\" : {
                  \"lat\" : -33.8797035,
                  \"lng\" : 151.1970329
               }
            },
            \"location\" : {
               \"lat\" : -33.8688197,
               \"lng\" : 151.2092955
            },
            \"location_type\" : \"APPROXIMATE\",
            \"viewport\" : {
               \"northeast\" : {
                  \"lat\" : -33.8561088,
                  \"lng\" : 151.222951
               },
               \"southwest\" : {
                  \"lat\" : -33.8797035,
                  \"lng\" : 151.1970329
               }
            }
         },
         \"place_id\" : \"ChIJP5iLHkCuEmsRwMwyFmh9AQU\",
         \"types\" : [ \"locality\", \"political\" ]
      }
   ],
   \"status\" : \"OK\"
}
";
            break;
        default:
            header('HTTP/1.1 400 Bad Request');
            echo "
{
   \"error_message\" : \"Invalid request. Invalid 'place_id' parameter.\",
   \"results\" : [],
   \"status\" : \"INVALID_REQUEST\"
}
";
    }
    exit;
}

error_log($_SERVER['REQUEST_METHOD']);
error_log($_SERVER['REQUEST_URI']);
header('HTTP/1.1 404 Not Found');
