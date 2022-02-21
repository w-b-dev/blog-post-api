exports.handler = async function (event, context) {
  const {
    requestContext: {
      stage,
      http: { method, path },
    },
    body,
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
