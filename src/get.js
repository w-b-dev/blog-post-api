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
  const consultaCQL = `SELECT creation_date, timestamp, id, title FROM posts.posts_by_day_of_month`; // 1a consulta CQL do dia
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
    message: respostaConsulta,
  };
};
exports.handler = handlerGET;
