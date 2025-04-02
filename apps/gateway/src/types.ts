import type { Context } from "hono";
import type { BlankEnv, BlankInput } from "hono/types";

export type Handler = Context<BlankEnv, "/", BlankInput>;
