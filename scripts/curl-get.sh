#!/bin/bash
curl https://api-staging.w-b.dev --request GET --verbose | jq '.'
