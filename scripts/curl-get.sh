#!/bin/bash
# These require JQ https://stedolan.github.io/jq/tutorial/
curl https://api-staging.w-b.dev --request GET --verbose | jq '.'
# curl https://cg3a2ru4dk.execute-api.us-east-1.amazonaws.com/blog-post -v -X PUT -H "Content-Type: application/json" --data @curl_body.json
