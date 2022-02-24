const handlerGET = (stage, stageVariables, path) => {
  return {
    // statusCode: 200,
    message: `GET ${path}`,
    stage: stage === "prod" ? null : stage,
    stageVariables: stage === "prod" ? null : stageVariables,
  };
};
const handlerPUT = (stage, stageVariables, body, path) => {
  return {
    // statusCode: 201,
    message: `PUT ${path}`,
    stage: stage === "prod" ? null : stage,
    stageVariables: stage === "prod" ? null : stageVariables,
    body: JSON.parse(body),
  };
};

exports.handler = async function (event, context) {
  const {
    requestContext: {
      stage,
      http: { method, path },
    },
    body,
    stageVariables,
  } = event;

  if (method === "GET") {
    return handlerGET(stage, stageVariables, path);
  }
  if (method === "PUT") {
    return handlerPUT(stage, stageVariables, body, path);
  }

  // Note: the below is not a valid response, since both teh route and the integration is not configured
  // https://console.aws.amazon.com/apigateway/main/develop/routes
  // https://console.aws.amazon.com/apigateway/main/develop/integrations/attach
  return {
    statusCode: 403,
    body: JSON.stringify({
      message: "METHOD IS NOT SUPPORTED",
    }),
  };
};
