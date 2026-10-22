import { getSubscriptionQueryKeys } from "@/features/subscription/services/subscription-query-keys";
import type { SubscriptionAdminRequest } from "@/features/subscription/types";
import { useMutationMapping } from "@/hooks/useClientMutator";
import { pathBuilder } from "@/services/path-builder";
import type { Identifiable } from "@/types/Types";

const BASE: string = `${import.meta.env.VITE_ADMINISTRATION_V1}/subs`;

const { administration } = getSubscriptionQueryKeys();

const subscriptionMutationBase = {
  invalidateKey: [...administration.all()],
  options: { meta: { clearAudit: true } },
};

export const useCreateSubscription = () =>
  useMutationMapping<SubscriptionAdminRequest, void>({
    uri: BASE,
    method: "post",
    ...subscriptionMutationBase,
  });

export const useEditSubscription = ({ id }: Identifiable) =>
  useMutationMapping<SubscriptionAdminRequest, void>({
    uri: pathBuilder.detail(BASE, id),
    method: "put",
    ...subscriptionMutationBase,
  });

export const useFinalizeSubscription = ({ id }: Identifiable) =>
  useMutationMapping<undefined, void>({
    uri: pathBuilder.detail(BASE, id),
    method: "patch",
    ...subscriptionMutationBase,
  });

export const useDeleteSubscription = ({ id }: Identifiable) =>
  useMutationMapping<undefined, void>({
    uri: pathBuilder.detail(BASE, id),
    method: "delete",
    ...subscriptionMutationBase,
  });
