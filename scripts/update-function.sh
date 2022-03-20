#!/bin/bash
[ -d ../build/function ] && rm -rf ../build/function
cd ../src || exit
# COPY CREDENTIALS HERE
#cp ../secrets/secure-dev.zip .
#cp ../secrets/secure-prod.zip .
# REMOVE OLDER PACKAGED FILE IF EXISTENT
[ -f function.zip ] && rm function.zip
[ -f index.js ] && zip -r -q -0 function.zip * node_modules
#rm *.zip
mv function.zip ../build
cd ../build || exit
aws lambda update-function-code --function-name  blog-post --zip-file fileb://function.zip
