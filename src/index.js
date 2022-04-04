const GET = require("./get");
const PUT = require("./put");
const DELETE = require("./delete");
const { Client } = require("cassandra-driver");

const DEV_STRING = "d";

exports.handler = async function (event, context) {
  // GET USEFUL ENVS FROM AWS AND REQUEST
  const {
    requestContext: {
      stage,
      http: { method, path },
    },
    body,
    stageVariables,
  } = event;
  // USEFUL VARIABLE TO PROVIDE MORE INFORMATION
  const isDevEnvironment = stage === DEV_STRING;
  // SHAREABLE CASSANDRA CONFIG
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
  // ROUTES
  try {
    if (method.toUpperCase() === "GET") {
      return GET.handler(
        clienteCassandra,
        isDevEnvironment,
        stageVariables,
        path,
        context
      );
    }
    if (method.toUpperCase() === "PUT") {
      return PUT.handler(
        clienteCassandra,
        isDevEnvironment,
        stageVariables,
        JSON.parse(body),
        path,
        context
      );
    }
    if (method.toUpperCase() === "DELETE") {
      return DELETE.handler(
        clienteCassandra,
        isDevEnvironment,
        stageVariables,
        JSON.parse(body),
        path,
        context
      );
    }
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: e,
      }),
    };
  }

  // Note: the below is not a valid response, since both
  // route and integration are not configured for anything other than GET/PUT
  // https://console.aws.amazon.com/apigateway/main/develop/routes
  // https://console.aws.amazon.com/apigateway/main/develop/integrations/attach
  return {
    statusCode: 403,
    body: JSON.stringify({
      message: "METHOD IS NOT SUPPORTED",
    }),
  };
};
