import { trpcServer } from "@hono/trpc-server"; // Deno 'npm:@hono/trpc-server'
import { Hono } from "hono";
import { cors } from "hono/cors";
import { appRouter } from "./router";

const app = new Hono();

app.use("*", cors());

app.use(
  "/*",
  trpcServer({
    endpoint: "/",
    router: appRouter,
    createContext: (opts, c) => {
      return {
        //
      };
    },
  })
);

export { app };
