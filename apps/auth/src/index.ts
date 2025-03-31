import * as grpc from "@grpc/grpc-js";
import { AuthService, type IAuthServer } from "grpc/auth/v1/auth_grpc_pb";
import { userSchema } from "database/db/schema";
import db from "database/index";
import { eq } from "drizzle-orm";

function getServer() {
  const server = new grpc.Server();

  server.addService(AuthService, {
    auth: async (payload, reply) => {
      const body = payload.request;

      const dbUser = await db
        .select()
        .from(userSchema)
        .where(eq(userSchema.email, body.getEmail()))
        .limit(1)
        .execute();

      if (!dbUser)
        return reply(new Error("No user were found with this email"), null);
    },
    checkToken: () => {},
    register: () => {},
  } satisfies IAuthServer);

  return server;
}

const routeServer = getServer();

// TODO: handle from ENV
routeServer.bindAsync(
  "0.0.0.0:50052",
  grpc.ServerCredentials.createInsecure(),
  () => {}
);
