#!/bin/bash
curl https://api-staging.w-b.dev/blog/ --request GET --verbose | jq '.'
