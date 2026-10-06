import { getQueryKeyProvider } from "@/services/query-key-provider";
import type { Identifiable } from "@/types/Types";

const { administration } = getQueryKeyProvider();
const userQueryKeyProvider = {
  administration: {
    all: () => [...administration, "user"],
    page: (params: Record<string, unknown>) =>
      [
        ...userQueryKeyProvider.administration.all(),
        "page",
        { ...params },
      ] as const,
    detail: ({ id }: Identifiable) => [
      ...userQueryKeyProvider.administration.all(),
      "detail",
      id,
    ],
  },
};
