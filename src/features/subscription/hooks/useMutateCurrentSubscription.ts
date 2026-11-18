import { getSubscriptionQueryKeys } from "@/features/subscription/services/subscription-query-keys";
import type {
  SubscriptionCurrentRequest,
  SubscriptionSessionResponse,
} from "@/features/subscription/types";
import { useMutationMapping } from "@/hooks/useClientMutator";

const BASE: string = import.meta.env.VITE_SUBSCRIPTION_CURRENT_V1;

const { current } = getSubscriptionQueryKeys();

const subscriptionMutationBase = {
  invalidateKey: [...current.all()],
  options: { meta: { clearAudit: true } },
};

export const useCreateCurrentSubscription = () =>
  useMutationMapping<SubscriptionCurrentRequest, SubscriptionSessionResponse>({
    uri: BASE,
    method: "post",
    ...subscriptionMutationBase,
  });

export const useRenewSubscription = () =>
  useMutationMapping<SubscriptionCurrentRequest, SubscriptionSessionResponse>({
    uri: BASE,
    method: "put",
    ...subscriptionMutationBase,
  });

export const useFinalizeCurrentSubscription = () =>
  useMutationMapping<SubscriptionCurrentRequest, SubscriptionSessionResponse>({
    uri: BASE,
    method: "patch",
    ...subscriptionMutationBase,
  });

export const useDeleteCurrentSubscription = () =>
  useMutationMapping<undefined, void>({
    uri: BASE,
    method: "delete",
    ...subscriptionMutationBase,
  });