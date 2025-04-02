import * as grpc from "@grpc/grpc-js";
import { AuthService, type IAuthServer } from "grpc/auth/v1/auth_grpc_pb";
import { userSchema } from "database/db/schema";
import db from "database/index";
import { eq } from "drizzle-orm";
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { AuthResponse } from "grpc/auth/v1/auth_pb";

function getServer() {
  const server = new grpc.Server();

  server.addService(AuthService, {
    auth: async (payload, reply) => {
      const body = payload.request;

      const dbUser = await db
        .select({
          id: userSchema.id,
          email: userSchema.email,
          passwordHash: userSchema.passwordHash,
          pepper: userSchema.pepper
        })
        .from(userSchema)
        .where(eq(userSchema.email, body.getEmail()))
        .limit(1)
        .execute();

      if (!dbUser)
        return reply(new Error("No user were found with this email"), null);

      const user = dbUser[0];

      const isRightPass = await bcrypt.compare(body.getPassword() + user.pepper, user.passwordHash)
      if (!isRightPass) {
        return reply(new Error("Wrong email or password"), null)
      }

      // TODO: check for env, maybe create a constatd object
      const token = jwt.sign({
        userId: user.id
      }, process.env.JWT_SECRET!, { expiresIn: '10m' })

      // TODO: save refresh token in db
      // TODO: reset old refresh token, create a new one with same exp date
      const refresh = jwt.sign({
        userId: user.id
      }, process.env.REFRESH_SECRET!, { expiresIn: '30d', encoding: 'RS256' })

      const response = new AuthResponse()
      response.setRefresh(refresh)
      response.setToken(token)

      reply(null, response)
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
