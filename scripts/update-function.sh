#!/bin/bash
cd ../src || exit
[ -f function.zip ] && rm function.zip
[ -f index.js ] && zip function.zip index.js
mv function.zip ../build
cd ../build || exit
aws lambda update-function-code --function-name  blog-post --zip-file fileb://function.zip
