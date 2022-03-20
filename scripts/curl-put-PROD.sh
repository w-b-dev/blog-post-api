#!/bin/bash
curl https://api.w-b.dev --verbose --request PUT --header "Content-Type: application/json" --data @curl_body.json | jq '.'
