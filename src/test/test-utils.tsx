import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeProvider";

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderProviders = (
  children: ReactNode,
  queryClient: QueryClient,
  route: string,
) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter initialEntries={[route]}>
      <ThemeProvider>{children}</ThemeProvider>
    </MemoryRouter>
  </QueryClientProvider>
);

type RenderWithProvidersOptions = Parameters<typeof render>[1] & {
  queryClient?: QueryClient;
  route?: string;
};

export const renderWithProviders = (
  ui: ReactElement,
  { queryClient, route = "/", ...renderOptions }: RenderWithProvidersOptions = {},
) => {
  const client = queryClient ?? createTestQueryClient();

  return {
    ...render(renderProviders(ui, client, route), renderOptions),
    queryClient: client,
  };
};
