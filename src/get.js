const { Client } = require("cassandra-driver"); // 🤩 a estrela de hoje

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
      secureConnectBundle: "secure-bundle.zip",
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
  const clienteCassandra = new Client(cassandraConfig); // inicializa o cliente
  await clienteCassandra.connect(); // aguarda a conexão ao banco
  const consultaCQL = `SELECT * FROM system.local`; // 1a consulta CQL do dia
  const respostaConsulta = await clienteCassandra.execute(consultaCQL);
  await clienteCassandra.shutdown(); // desconecta ao banco
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

  const response = {
    message: "Winter is coming",
  };
  response.message = "THIS-IS-SPARTA!!!";
  return response;
};
exports.handler = handlerGET;
