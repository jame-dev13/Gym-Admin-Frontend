import type { ApiErrorResponse } from "@/types/Types";

const COUNT_FORMATTER = new Intl.NumberFormat("es-MX", {
  maximumFractionDigits: 0,
});

const MONEY_FORMATTER = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const formatEvolutionCount = (value: number): string =>
  COUNT_FORMATTER.format(value);

export const formatEvolutionMoney = (value: number): string =>
  MONEY_FORMATTER.format(value);

export const getEvolutionYearOptions = (
  currentYear = new Date().getFullYear(),
  totalYears = 5,
): number[] => {
  const safeTotalYears = Math.max(1, Math.floor(totalYears));

  return Array.from(
    { length: safeTotalYears },
    (_, index) => currentYear - index,
  );
};

export const resolveEvolutionError = (
  error: ApiErrorResponse | null | undefined,
  fallback: string,
): string | null => {
  if (!error) {
    return null;
  }

  return error.message ?? error.error ?? fallback;
};
