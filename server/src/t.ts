import { initTRPC } from "@trpc/server";
import { Context } from "./Context";

export const t = initTRPC.context<Context>().create();
