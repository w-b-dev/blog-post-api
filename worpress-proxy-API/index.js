exports.handler = async (event) => {
  const { requestContext = { nothing: "here" } } = event;
  return {
    statusCode: 200,
    body: JSON.stringify(requestContext),
  };
};
