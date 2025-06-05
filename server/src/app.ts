import { trpcServer } from "@hono/trpc-server"; // Deno 'npm:@hono/trpc-server'
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { Context } from "./Context";
import { db } from "./db";
import { User } from "./db/schema";
import { appRouter } from "./router";

const app = new Hono();

app.use("*", cors());

app.use(
  "/*",
  trpcServer({
    endpoint: "/",
    router: appRouter,
    createContext: async (opts, c): Promise<Context> => {
      const token = opts.req.headers.get("Authorization")?.split(" ")[1];
      const user =
        token !== undefined
          ? await db.query.User.findFirst({
              where: eq(User.token, token),
            })
          : null;
      if (user === undefined) {
        throw new Error("Unauthorized");
      }
      if (user === null) {
        return { type: "unauthenticated" };
      }
      return {
        type: "authenticated",
        user: { id: user.id, login: user.login },
      };
    },
  })
);

export { app };
