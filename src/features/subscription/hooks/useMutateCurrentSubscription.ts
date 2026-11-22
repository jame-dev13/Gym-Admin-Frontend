import { getPaymentQueryKeys } from "@/features/payment/services/payment-query-keys";
import { getSubscriptionQueryKeys } from "@/features/subscription/services/subscription-query-keys";
import type {
  SubscriptionCurrentRequest,
  SubscriptionSessionResponse,
} from "@/features/subscription/types";
import { useMutationMapping } from "@/hooks/useClientMutator";
import { getQueryAppClient } from "@/services/query-client";

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
    options: {
      onSettled: () =>
        getQueryAppClient().invalidateQueries({
          queryKey: getPaymentQueryKeys().current.all(),
        }),
    },
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
