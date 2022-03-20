const { Client } = require("cassandra-driver");

/**
 * This is the ROUTE-LEVEL handler for GET requests
 * @param isDevEnvironment
 * @param stageVariables
 * @param path
 * @param context
 * @returns {{message: string}|{isDevEnvironment: string, path: string, context, message: string, stageVariables}}
 */
const handlerGET = async (isDevEnvironment, stageVariables, path, context) => {
  const cassandraConfig = {
    cloud: {
      secureConnectBundle: stageVariables.secure_bundle,
    },
    credentials: {
      username: stageVariables.astra_username,
      password: Buffer.from(
        stageVariables.astra_password_base64,
        "base64"
      ).toString("ascii"),
    },
    keyspace: "posts",
  };
  const clienteCassandra = new Client(cassandraConfig);
  await clienteCassandra.connect();
  const consultaCQL = `SELECT * FROM system.local`; // 1a consulta CQL do dia
  const respostaConsulta = await clienteCassandra.execute(consultaCQL);
  await clienteCassandra.shutdown();
  if (isDevEnvironment) {
    const { logStreamName, awsRequestId } = context;
    return {
      isDevEnvironment: "🙈🙊🙉",
      path: `GET ${path}`,
      message: respostaConsulta,
      stageVariables: stageVariables,
      tracing: {
        logStreamName,
        awsRequestId,
      },
    };
  }

  return {
    message: respostaConsulta,
  };
};
exports.handler = handlerGET;
