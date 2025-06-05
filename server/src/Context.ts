import { UserView } from "./views";

export type Context =
  | {
      type: "authenticated";
      user: UserView;
    }
  | {
      type: "unauthenticated";
    };
