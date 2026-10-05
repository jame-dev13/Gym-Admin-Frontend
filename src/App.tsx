import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { AppRouter } from "@/router/AppRouter";
import { ThemeProvider } from "@/context/ThemeProvider";
import { ToastProvider } from "@/context/ToastProvider";
import "./App.css";
import {
  QueryClientProvider,
  QueryErrorResetBoundary,
} from "@tanstack/react-query";
import { getQueryAppClient } from "@/services/query-client";

const QUERY_CLIENT = getQueryAppClient();

function App() {
  return (
    <>
      <QueryClientProvider client={QUERY_CLIENT}>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary onReset={reset}>
              <ThemeProvider>
                <ToastProvider>
                  <AppRouter />
                </ToastProvider>
              </ThemeProvider>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </QueryClientProvider>
    </>
  );
}

export default App;
