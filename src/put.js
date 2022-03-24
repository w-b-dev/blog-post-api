const {types} = require("cassandra-driver");
const {criacaoTabelaCQLPostsByDate, insercaoTabelaCQLPostsByDate, deletarTabelaCQL} = require("./queries");
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
const handlerPUT = async (
    clienteCassandra,
    isDevEnvironment,
    stageVariables,
    body,
    path,
    context
) => {
    // POST_ID
    const idGerado = uuid.random();
    // POST_TIMESTAMP
    const agora = new Date(Date.now());
    // POST_CREATION_DATE
    const dataDeHoje = agora.toLocaleDateString("en-ca", {
        timeZone: "America/Halifax",
    });

    // PREPARED STATEMENT PARAMS
    const insercaoTabelaParams = [
        dataDeHoje,
        agora
            .toLocaleString("en-ca", {
                timeZone: "America/Halifax",
                hour12: false,
            })
            .replace(", ", " "),
        idGerado,
        body.data.post_title +
        ` [${agora.toLocaleTimeString("en-ca", {
            timeZone: "America/Halifax",
        })}]`,
        body.data.post_body,
        body.data.post_image,
        body.data.post_is_favorite,
        body.data.post_category,
    ];
    // await clienteCassandra.execute(deletarTabelaCQL);
    await clienteCassandra.execute(criacaoTabelaCQLPostsByDate);
    // INSERTS, UPDATES AND DELETES CAN BE BATCHED
    // https://docs.datastax.com/en/developer/nodejs-driver/4.6/features/batch/
    await clienteCassandra.execute(insercaoTabelaCQLPostsByDate, insercaoTabelaParams, {
        prepare: true,
    });

    if (isDevEnvironment) {
        const {logStreamName, awsRequestId} = context;
        // SHUTDOWN ANTES DE RETORNAR
        await clienteCassandra.shutdown();
        return {
            isDevEnvironment: "🚧 ➲ 🚧 ➲ 🚧 ➲ 🚧",
            message: `ID CREATED ${idGerado}`,
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
        body: idGerado,
    };
};
exports.handler = handlerPUT;
