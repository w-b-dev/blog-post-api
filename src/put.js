const {types} = require("cassandra-driver");
const uuid = types.Uuid;

const deletarTabelaCQL = `
    DROP TABLE IF EXISTS posts.posts_by_day_of_month`;

/* WHAT AM I EXPECTING TO QUERY?
* - GET ME ALL RECENT POSTS
* */

// https://docs.datastax.com/en/astra-cql/doc/cql/cql_reference/refDataTypes.html
const criacaoTabelaCQLPostsByDate = `
    CREATE TABLE IF NOT EXISTS posts.posts_by_date
    (
        post_creation_date timestamp,
        post_timestamp timestamp,
        post_id UUID,
        post_title text,
        post_body text,
        post_image text,
        post_is_favorite boolean,
        post_category text,
        PRIMARY KEY ((post_creation_date), post_timestamp, post_id)
    )
  `; // criacao da tabela 1
const criacaoTabelaCQLPostsByCategory = `
    CREATE TABLE IF NOT EXISTS posts.posts_by_category
    (
        post_category string,
        post_creation_date timestamp,
        post_timestamp timestamp,
        post_id UUID,
        post_title text,
        post_body text,
        post_image text,
        post_is_favorite boolean,
        PRIMARY KEY ((post_category, post_creation_date), post_timestamp, post_id)
    )
  `; // criacao da tabela 2
const insercaoTabelaCQLPostsByDate = `
    INSERT INTO posts.posts_by_date
    (
        post_creation_date,
        post_timestamp,
        post_id,
        post_title,
        post_body,
        post_image,
        post_is_favorite,
        post_category
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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
        body.data.post_title +
        ` [${agora.toLocaleTimeString("en-ca", {
            timeZone: "America/Halifax",
        })}]`,
        body.data?.post_body ?? "",
        body.data?.post_image ?? "",
        body.data?.post_is_favorite ?? false,
        body.data?.post_category ?? "",
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
            // message: `PUT ${path}`,
            message: insercaoTabelaParams,
            body: body,
            // body: idGerado,
            // stageVariables,
            // tracing: {
            //     logStreamName,
            //     awsRequestId,
            // },
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
