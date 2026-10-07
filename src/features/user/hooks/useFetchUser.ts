import { userQueryKeyProvider } from "@/features/user/services/UserQueryKeyProvider";
import type { UserResponse } from "@/features/user/types";
import { useFetchMapping, usePageFetchMapping } from "@/hooks/useClientFetcher";
import { pathBuilder } from "@/services/path-builder";
import type { Identifiable } from "@/types/Types";

const BASE: string = `${import.meta.env.VITE_ADMINISTRATION_V1}/users`;
const { administration } = userQueryKeyProvider;

export const useGetUserPage = (params?: Record<string, unknown>) =>
  usePageFetchMapping<UserResponse>({
    uri: BASE,
    queryKey: [...administration.all(), "page"],
    params,
  });

export const useGetUser = (id: Identifiable) =>
  useFetchMapping<UserResponse>({
    uri: pathBuilder.detail(BASE, id.id),
    queryKey: [...administration.detail(id)],
    options: { enabled: !!id.id },
  });
