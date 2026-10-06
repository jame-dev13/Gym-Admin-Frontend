import { userQueryKeyProvider } from "@/features/user/services/UserQueryKeyProvider";
import type {
  UserRequest,
  UserResponse,
  UserUpdateRequest,
} from "@/features/user/types";
import { useMutationMapping } from "@/hooks/useClientMutator";
import { pathBuilder } from "@/services/path-builder";
import type { Identifiable } from "@/types/Types";

const BASE: string = `${import.meta.env.VITE_ADMINISTRATION_V1}/users`;
const { administration } = userQueryKeyProvider;

const userMutationBase = {
  invalidateKey: [...administration.all()],
  options: { meta: { clearAudit: true } },
};

export const useCreateUser = () =>
  useMutationMapping<UserRequest, UserResponse>({
    uri: BASE,
    method: "post",
    ...userMutationBase,
  });

export const useUpdateUser = (id: Identifiable) =>
  useMutationMapping<UserUpdateRequest, UserResponse>({
    uri: pathBuilder.detail(BASE, id.id),
    method: "put",
    ...userMutationBase,
  });

export const useRecoverUser = (id: Identifiable) =>
  useMutationMapping<undefined, void>({
    uri: pathBuilder.action(BASE, id.id, "recover"),
    method: "patch",
    ...userMutationBase,
  });

export const useDeleteUser = (id: Identifiable) =>
  useMutationMapping<undefined, void>({
    uri: pathBuilder.detail(BASE, id.id),
    method: "delete",
    ...userMutationBase,
  });

export const useHardDeleteUser = (id: Identifiable) =>
  useMutationMapping<undefined, void>({
    uri: pathBuilder.action(BASE, id.id, "hard"),
    method: "delete",
    ...userMutationBase,
  });
