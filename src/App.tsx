import { AppRouter } from "@/router/AppRouter";
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
          <AppRouter />
        </QueryErrorResetBoundary>
      </QueryClientProvider>
    </>
  );
}

export default App;
