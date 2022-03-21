const { types } = require("cassandra-driver");
const uuid = types.Uuid;

const deletarTabelaCQL = `
    DROP TABLE IF EXISTS posts.posts_by_day_of_month`;
// https://docs.datastax.com/en/astra-cql/doc/cql/cql_reference/refDataTypes.html
const criacaoTabelaCQL = `
    CREATE TABLE IF NOT EXISTS posts.posts_by_day_of_month
    (
        creation_date timestamp,
        timestamp timestamp,
        id UUID,
        title text,
        body text,
        PRIMARY KEY ((creation_date), timestamp, id)
    )
  `; // criacao da tabela
const insercaoTabelaCQL = `
    INSERT INTO posts_by_day_of_month
    (
        creation_date,
        timestamp,
        id,
        title,
        body
    ) VALUES (?, ?, ?, ?, ?)
  `; // prepared statement para insercao na tabela

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
const handlerPUT = async (
  clienteCassandra,
  isDevEnvironment,
  stageVariables,
  body,
  path,
  context
) => {
  const idGerado = uuid.random();
  const agora = new Date(Date.now());
  const dataDeHoje = agora.toLocaleDateString("en-ca", {
    timeZone: "America/Halifax",
  });
  const insercaoTabelaParams = [
    dataDeHoje,
    agora
      .toLocaleString("en-ca", {
        timeZone: "America/Halifax",
        hour12: false,
      })
      .replace(", ", " "),
    idGerado,
    body.data.title +
      ` [${agora.toLocaleTimeString("en-ca", {
        timeZone: "America/Halifax",
      })}]`,
    body.data.body,
  ];
  // await clienteCassandra.execute(deletarTabelaCQL);
  await clienteCassandra.execute(criacaoTabelaCQL);
  // INSERTS, UPDATES AND DELETES CAN BE BATCHED
  // https://docs.datastax.com/en/developer/nodejs-driver/4.6/features/batch/
  await clienteCassandra.execute(insercaoTabelaCQL, insercaoTabelaParams, {
    prepare: true,
  });

  if (isDevEnvironment) {
    const { logStreamName, awsRequestId } = context;
    // SHUTDOWN ANTES DE RETORNAR
    await clienteCassandra.shutdown();
    return {
      isDevEnvironment: "🚧 ➲ 🚧 ➲ 🚧 ➲ 🚧",
      // message: `PUT ${path}`,
      // message: respostaConsulta,
      // body: body,
      body: idGerado,
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
    statusCode: 201,
    body: idGerado,
  };
};
exports.handler = handlerPUT;
