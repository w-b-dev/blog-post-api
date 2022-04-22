const { types } = require("cassandra-driver");
const { deleteByID } = require("./queries");
const uuid = types.Uuid;

/**
 * This is the ROUTE-LEVEL handler for PUT requests
 * @param clienteCassandra
 * @param isDevEnvironment
 * @param stageVariables
 * @param body
 * @param path
 * @param context
 * @returns {{statusCode: number}|{tracing: {logStreamName, awsRequestId}, isDevEnvironment: string, message: string, body: any, stageVariables}}
 */
const handlerDELETE = async (
  clienteCassandra,
  isDevEnvironment,
  stageVariables,
  queryStringParameters,
  path,
  context
) => {
  // POST_ID
  const id = queryStringParameters.post_id;
  const timestamp = queryStringParameters.post_timestamp;
  const creation_date = queryStringParameters.post_creation_date;
  // INSERTS, UPDATES AND DELETES CAN BE BATCHED
  // https://docs.datastax.com/en/developer/nodejs-driver/4.6/features/batch/
  await clienteCassandra.execute(deleteByID, [creation_date, timestamp, id], {
    prepare: true,
  });

  if (isDevEnvironment) {
    const { logStreamName, awsRequestId } = context;
    // SHUTDOWN ANTES DE RETORNAR
    await clienteCassandra.shutdown();
    return {
      isDevEnvironment: "🚧 ➲ 🚧 ➲ 🚧 ➲ 🚧",
      message: `ID ${id} deletado`,
      // queryStringParameters: queryStringParameters,
      // stageVariables,
      tracing: {
        logStreamName,
        awsRequestId,
      },
    };
  }
  // SHUTDOWN ANTES DE RETORNAR
  await clienteCassandra.shutdown();
  /* PUT has no return body. Put is IDEMPOTENT (several repeated requests should cause 1 transformation only)
   * - if content was created, return 201
   * - if content was modified, return 204 */
  return {
    body: id,
  };
};
exports.handler = handlerDELETE;
