import { initTRPC } from "@trpc/server";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "./db";
import { User } from "./db/schema";

const t = initTRPC.create();

const publicProcedure = t.procedure;
const router = t.router;

const SALT_ROUNDS = 10;

export const appRouter = router({
  login: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const [user] = await db
        .select()
        .from(User)
        .where(eq(User.login, input.username))
        .limit(1);

      if (!user) {
        return { success: false, error: "User not found" };
      }

      const passwordMatch = await bcrypt.compare(input.password, user.password);
      if (!passwordMatch) {
        return { success: false, error: "User not found" };
      }

      return { success: true, user };
    }),
  register: publicProcedure
    .input(
      z.object({
        username: z.string().min(1),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      const hashedPassword = await bcrypt.hash(input.password, salt);
      const user = await db.insert(User).values({
        login: input.username,
        password: hashedPassword,
      });
      return { success: true, user };
    }),
});

export type AppRouter = typeof appRouter;
