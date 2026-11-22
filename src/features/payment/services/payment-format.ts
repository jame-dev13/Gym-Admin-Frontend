const amountFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending",
  COMPLETED: "Completed",
  FAILED: "Failed",
  REFUNDED: "Refunded",
  FINALIZED: "Finalized",
};

const METHOD_LABEL: Record<string, string> = {
  ELECTRONIC: "Electronic",
  PHYSIC: "Physic",
};

export const formatPaymentAmount = (amount: number) =>
  amountFormatter.format(amount);

export const formatPaymentDate = (createdAt: string) => {
  const date = new Date(createdAt);

  return Number.isNaN(date.getTime()) ? createdAt : dateFormatter.format(date);
};

export const formatPaymentStatus = (status: string) =>
  STATUS_LABEL[status] ?? status.replaceAll("_", " ").toLowerCase();

export const formatPaymentMethod = (method: string) =>
  METHOD_LABEL[method] ?? method.replaceAll("_", " ").toLowerCase();
