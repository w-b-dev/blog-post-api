#!/bin/bash
# curl https://api-staging.w-b.dev -X PUT -H "Content-Type: application/json" --data @curl_body.json
# curl https://api-staging.w-b.dev --silent --verbose --show-error --request PUT --header "Content-Type: application/json" --data @curl_body.json
# These require JQ https://stedolan.github.io/jq/tutorial/
curl https://api-staging.w-b.dev/blog/ --verbose --request DELETE --header "Content-Type: application/json" | jq '.'
# curl https://cg3a2ru4dk.execute-api.us-east-1.amazonaws.com/blog-post -v -X PUT -H "Content-Type: application/json" --data @curl_body.json
