#!/bin/bash
curl https://api.w-b.dev/blog/ --request GET --verbose | jq '.'
