#!/bin/bash
# These require JQ https://stedolan.github.io/jq/tutorial/
#curl https://wp-api-dev.w-b.dev --request GET --verbose | jq '.'
curl https://65xg1ywiwk.execute-api.us-east-1.amazonaws.com --request GET --verbose | jq '.'
