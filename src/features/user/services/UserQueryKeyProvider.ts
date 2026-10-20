import { getQueryKeyProvider } from "@/services/query-key-provider";
import type { Identifiable } from "@/types/Types";

const { administration } = getQueryKeyProvider();

const USER_DOMAIN_KEY = ["user"] as const;

const getQueryDomainKey = () => USER_DOMAIN_KEY;

const userQueryKeyProvider = {
  administration: {
    all: () => [...administration, ...getQueryDomainKey()],
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

export { getQueryDomainKey, userQueryKeyProvider };
