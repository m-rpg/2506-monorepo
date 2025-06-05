import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "./db";
import { User } from "./db/schema";
import { t } from "./t";
import { Result } from "./types/Result";

const SALT_ROUNDS = 10;

export const appRouter = t.router({
  login: t.procedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(
      async ({
        input,
        ctx,
      }): Promise<
        Result<
          string,
          "Already logged in" | "User not found or invalid password"
        >
      > => {
        if (ctx.type === "authenticated") {
          return { success: false, error: "Already logged in" };
        }

        const [user] = await db
          .select()
          .from(User)
          .where(eq(User.login, input.username))
          .limit(1);

        if (!user) {
          return {
            success: false,
            error: "User not found or invalid password",
          };
        }

        const passwordMatch = await bcrypt.compare(
          input.password,
          user.password
        );
        if (!passwordMatch) {
          return {
            success: false,
            error: "User not found or invalid password",
          };
        }

        const token = crypto.randomUUID();
        await db.update(User).set({ token }).where(eq(User.id, user.id));

        return { success: true, data: token };
      }
    ),
  register: t.procedure
    .input(
      z.object({
        username: z.string().min(1),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.type === "authenticated") {
        return { success: false, error: "Already logged in" };
      }

      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      const hashedPassword = await bcrypt.hash(input.password, salt);
      const user = await db.insert(User).values({
        login: input.username,
        password: hashedPassword,
      });
      return { success: true, user };
    }),
  hello: t.procedure.query(async ({ ctx }) => {
    if (ctx.type !== "authenticated") {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return { message: `Hello, ${ctx.user.login}!` };
  }),
});

export type AppRouter = typeof appRouter;
