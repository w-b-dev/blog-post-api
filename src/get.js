const { getDataDeHoje } = require("./utils");

/**
 * This is the ROUTE-LEVEL handler for GET requests
 * @param clienteCassandra
 * @param isDevEnvironment
 * @param stageVariables
 * @param path
 * @param context
 * @returns {{message: string}|{isDevEnvironment: string, path: string, context, message: string, stageVariables}}
 */
const handlerGET = async (
  clienteCassandra,
  isDevEnvironment,
  stageVariables,
  path,
  context
) => {
  const consultaCQL = `SELECT * FROM posts.posts_by_date`; // 1a consulta CQL do dia
  // const consultaCQL = `SELECT * FROM posts.posts_by_date WHERE post_creation_date = '${getDataDeHoje()}' ORDER BY post_timestamp DESC ALLOW FILTERING`; // 1a consulta CQL do dia
  const respostaConsulta = await clienteCassandra.execute(consultaCQL);
  const rows = Array.from(respostaConsulta.rows);

  if (isDevEnvironment) {
    const { logStreamName, awsRequestId } = context;
    // SHUTDOWN ANTES DE RETORNAR
    await clienteCassandra.shutdown();
    return {
      isDevEnvironment: "🙈🙊🙉",
      // path: `GET ${path}`,
      message: rows,
      // stageVariables: stageVariables,
      tracing: {
        logStreamName,
        awsRequestId,
      },
    };
  }

  // SHUTDOWN ANTES DE RETORNAR
  await clienteCassandra.shutdown();
  return {
    message: rows,
  };
};
exports.handler = handlerGET;
