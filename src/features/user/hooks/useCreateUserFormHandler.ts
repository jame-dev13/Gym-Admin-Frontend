import { useDrawerContext } from "@/context/useDrawerContext";
import { useCreateUser } from "@/features/user/hooks/useMutateUser";
import type { UserRequest } from "@/features/user/types";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";

export const useCreateUserFormHandler = () => {
  const { showSuccess, showError } = useToastFactory();
  const { closeDrawer } = useDrawerContext();
  const { isPending, submit } = useMutationHandler({
    mutationHook: useCreateUser,
    payloadBuilder: (fd) => ({
      name: String(fd?.get("name")),
      email: String(fd?.get("email")),
      password: String(fd?.get("password")),
      authProvider: String(
        fd?.get("authProvider"),
      ) as UserRequest["authProvider"],
      roles: String(fd?.get("roles")).split(","),
    }),
    resultHandlers: {
      onSuccess: () => showSuccess(`User successfully created.`),
      onError: (err) => showError(`Cannot create new user: ${err?.message}`),
      onSettled: closeDrawer,
    },
  });

  return {
    isPending,
    submit
  };
};
