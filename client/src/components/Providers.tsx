import { QueryClient } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createContext, PropsWithChildren, useMemo, useState } from "react";
import { trpc } from "../trpc";

export function Providers({ children }: PropsWithChildren) {
  return <AppContextProvider>{children}</AppContextProvider>;
}

export interface AppContextType {
  isAuthenticated: boolean;
  setAuthToken: (token: string | undefined) => void;
}

export const AppContext = createContext<AppContextType>(
  undefined as unknown as AppContextType,
);

function AppContextProvider({ children }: PropsWithChildren) {
  const [authToken, setAuthToken] = useState<string | undefined>(undefined);
  const queryClient = useMemo(() => new QueryClient(), []);
  const trpcClient = useMemo(
    () =>
      trpc.createClient({
        links: [
          httpBatchLink({
            url: process.env.SERVER_URL!,
            headers: {
              ...(authToken && { Authorization: `Bearer ${authToken}` }),
            },
          }),
        ],
      }),
    [authToken],
  );
  const isAuthenticated = useMemo(() => authToken !== undefined, [authToken]);
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <AppContext.Provider
        value={useMemo(
          () => ({ isAuthenticated, setAuthToken }),
          [isAuthenticated, setAuthToken],
        )}
      >
        {children}
      </AppContext.Provider>
    </trpc.Provider>
  );
}
