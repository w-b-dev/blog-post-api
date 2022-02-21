# create a lambda function

- must have aws cli installed
- create an execution role

```aw
aws iam create-role --role-name blog-post-lambda --assume-role-policy-document '{"Version": "2012-10-17","Statement": [{ "Effect": "Allow", "Principal": {"Service": "lambda.amazonaws.com"}, "Action": "sts:AssumeRole"}]}'
```

- add permissions to the role

```aw
aws iam attach-role-policy --role-name blog-post-lambda --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
```

- create function code (index.js)

```js
exports.handler = async function(event, context) {
  // console.log("ENVIRONMENT VARIABLES\n" + JSON.stringify(process.env, null, 2))
  // console.log("EVENT\n" + JSON.stringify(event, null, 2))
  // return context.logStreamName
  return 'Hi! (I am a string)'
}
```

### Side note on the response format
- Header names are lowercased.
- Look at the link below to see more about `stageVariables`, `pathParameters`, `queryStringParameters`, `requestContext (stage, domainPrefix, http)`, `rawPath`, `cookies`, `headers` and `body`

API Gateway will be wired soon after we create the function. [It relies on an specific response format](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html#http-api-develop-integrations-lambda.response). If the response format is not provided, it will infer what to use (i.e.defaults are provided)
```json
{
    "cookies" : ["cookie1", "cookie2"],
    "isBase64Encoded": true|false,
    "statusCode": httpStatusCode,
    "headers": { "headername": "headervalue", ... },
    "body": "Hi! (I am a string)"
}      
```
___

- create the deployment package (good old .zip)

```aw
zip function.zip index.js
```
### This is important
- get the account ID from the output of the permission creation command (look for ARN)
---
- now CREATE the actual function!

```aw
aws lambda create-function --function-name blog-post \
--zip-file fileb://function.zip --handler index.handler --runtime nodejs12.x \
--role arn:aws:iam::MY_VERY_OWN_ACCOUNT_UD:role/lambda-ex
```
### AWS API Gateway
By default, clients can invoke your API with the default `https://{api_id}.execute-api.{region}.amazonaws.com` endpoint.

```
aws apigatewayv2 create-api \
  --name blog-post-api 
  --description "a catch all api endpoint for blog posts"
  --protocol-type HTTP 
  --target TYPE-THE-FUNCTION-ARN-HERE
```

We should now have an endpoint generated at `https://foo.execute-api.bar.amazonaws.com/blog-post` which includes the name of the lambda

----------NOTE-------------

**I DID NOT RUN THIS MANUALLY -- INSTEAD I ADDED A TRIGGER IN THE LAMBDA DIRECTLY, MENTIONING API GATEWAY**

We want to allow API Gateway to invoke the function we just created.

- `replace` STATEMENT-ID

- `replace` SOURCE-ARN (**Note this is for the SNS resource**)

```aw
aws lambda add-permission --function-name blog-post --action lambda:InvokeFunction --statement-id sns-my-topic \
--principal sns.amazonaws.com --source-arn arn:aws:sns:us-east-2:123456789012:my-topic
```
----------NOTE-------------

### Create stages

It is useful to have stages for `dev` and `prod`.

```
aws apigatewayv2 create-stage \
  --api-id foo \
  --stage-name dev
```
And `foo` above comes from

```
aws apigatewayv2 get-apis
```

## Script to get logs

- create `get-logs.sh`
- add execution permissions with `chmod +X get-logs.sh`

```sh
#!/bin/bash
aws lambda invoke --function-name blog-post --cli-binary-format raw-in-base64-out --payload '{"key": "value"}' out
sed -i'' -e 's/"//g' out
sleep 15
aws logs get-log-events --log-group-name /aws/lambda/blog-post --log-stream-name $(cat out) --limit 5
```
### Updating the lambda code

See [this](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/lambda/update-function-code.html) for instructions

```
aws lambda update-function-code \
    --function-name  blog-post \
    --zip-file fileb://function.zip
```

or more completely

```sh
#!/bin/bash
rm function.zip
zip function.zip index.js
aws lambda update-function-code --function-name  blog-post --zip-file fileb://function.zip
```

## Retrieve the latest deployment package

```aw
aws lambda get-function --function-name blog-post
```
