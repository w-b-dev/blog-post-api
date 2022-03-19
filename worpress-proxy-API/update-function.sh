#!/bin/bash
#rm function.zip
zip function.zip index.js
aws lambda update-function-code --function-name  worpress-proxy --zip-file fileb://function.zip
