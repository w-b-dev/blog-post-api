/**
 * This is the ROUTE-LEVEL handler for PUT requests
 * @param isDevEnvironment
 * @param stageVariables
 * @param body
 * @param path
 * @param context
 * @returns {{statusCode: number}|{tracing: {logStreamName, awsRequestId}, isDevEnvironment: string, message: string, body: any, stageVariables}}
 */
const handlerPUT = (isDevEnvironment, stageVariables, body, path, context) => {
  if (isDevEnvironment) {
    const { logStreamName, awsRequestId } = context;
    return {
      isDevEnvironment: "🚧 ➲ 🚧 ➲ 🚧 ➲ 🚧",
      message: `PUT ${path}`,
      body: JSON.parse(body),
      stageVariables,
      tracing: {
        logStreamName,
        awsRequestId,
      },
    };
  }

  /* PUT has no return body. Put is IDEMPOTENT (several repeated requests should cause 1 transformation only)
   * - if content was created, return 201
   * - if content was modified, return 204 */
  return {
    statusCode: Math.random() > 0.5 ? 201 : 204,
  };
};
exports.handler = handlerPUT;
