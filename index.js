exports.handler = async function (event, context) {
  // console.log("ENVIRONMENT VARIABLES\n" + JSON.stringify(process.env, null, 2))
  // console.log("EVENT\n" + JSON.stringify(event, null, 2))
  // return context.logStreamName
  const {
    requestContext: {
      stage,
      // domainPrefix,
      http: { method, path },
    },
    body,
    // cookies,
    // headers,
    // stageVariables,
  } = event;
  if (method === "GET") {
    return {
      message: "GET",
      stage,
    };
  }
  if (method === "PUT") {
    return { message: "PUT", stage, body: JSON.parse(body) };
  }

  return {
    statusCode: 403,
    body: JSON.stringify({ message: "METHOD IS NOT SUPPORTED" }),
  };
};
