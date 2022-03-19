#!/bin/bash
# These require JQ https://stedolan.github.io/jq/tutorial/
curl https://65xg1ywiwk.execute-api.us-east-1.amazonaws.com --verbose --request PUT --header "Content-Type: application/json" --data @curl_body.json | jq '.'
