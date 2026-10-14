import { useDrawerContext } from "@/context/useDrawerContext";
import { useSelectionContext } from "@/context/useSelectionContext";
import { useGetUser } from "@/features/user/hooks/useFetchUser";
import { useUpdateUser } from "@/features/user/hooks/useMutateUser";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";

export const useUpdateUserFormHandler = () => {
  const { currentSelection: id, clearSelection } = useSelectionContext();
  const { closeDrawer } = useDrawerContext();
  const { showError, showSuccess } = useToastFactory();

  if (!id || !id.id) {
    throw new Error("User id is required");
  }

  const { data, isLoading, isError, error } = useGetUser(id);
  const hook = useUpdateUser(id);
  const {
    submit,
    isPending,
    error: updateError,
  } = useMutationHandler({
    id: id ?? "",
    mutationHook: () => hook,
    payloadBuilder: (fd) => ({
      name: String(fd?.get("name")),
      email: String(fd?.get("email")),
      roles: String(fd?.get("roles")).split(","),
    }),
    resultHandlers: {
      onSuccess: () => showSuccess("User info updated successfully."),
      onError: (err) => {
        showError(`Cannot update user info: ${err?.message}`);
      },
      onSettled: () => {
        clearSelection();
        closeDrawer();
      },
    },
  });

  return {
    fetch: {
      result: data?.data,
      isLoading,
      isFetchingError: isError,
      fetchingError: error,
    },
    mutation: {
      submit,
      isPending,
      updateError,
    },
  };
};
