#!/bin/bash
rm function.zip
zip function.zip index.js
aws lambda update-function-code --function-name  blog-post --zip-file fileb://function.zip