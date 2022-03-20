const GET = require("./get");
const PUT = require("./put");

const DEV_STRING = "d";

exports.handler = async function (event, context) {
  const {
    requestContext: {
      stage,
      http: { method, path },
    },
    body,
    stageVariables,
  } = event;
  const isDevEnvironment = stage === DEV_STRING;
  try {
    if (method.toUpperCase() === "GET") {
      return GET.handler(isDevEnvironment, stageVariables, path, context);
    }
    if (method.toUpperCase() === "PUT") {
      return PUT.handler(isDevEnvironment, stageVariables, body, path, context);
    }
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: e,
      }),
    };
  }

  // Note: the below is not a valid response, since both
  // route and integration are not configured for anything other than GET/PUT
  // https://console.aws.amazon.com/apigateway/main/develop/routes
  // https://console.aws.amazon.com/apigateway/main/develop/integrations/attach
  return {
    statusCode: 403,
    body: JSON.stringify({
      message: "METHOD IS NOT SUPPORTED",
    }),
  };
};
