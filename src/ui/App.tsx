import { httpBatchLink } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Surfaces, useNetlifyExtensionUIFetch } from "@netlify/sdk/ui/react";
import { SurfaceRouter, SurfaceRoute } from "@netlify/sdk/ui/react/components";
import { useState } from "react";
import { Configuration } from "./surfaces/Configuration.js";

import { trpc } from "./trpc.js";

export const App = () => {
  const fetch = useNetlifyExtensionUIFetch();
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          fetch,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <SurfaceRouter>
          <SurfaceRoute surface={Surfaces.SiteConfiguration}>
            <Configuration />
          </SurfaceRoute>

          <SurfaceRoute surface={Surfaces.TeamConfiguration}>
            <Configuration />
          </SurfaceRoute>
        </SurfaceRouter>
      </QueryClientProvider>
    </trpc.Provider>
  );
};
