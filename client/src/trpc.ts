import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { AppRouter } from "shared";

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: process.env.SERVER_URL!,
    }),
  ],
});
