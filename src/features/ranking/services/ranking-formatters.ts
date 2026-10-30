const capitalizeWord = (word: string): string =>
  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

/**
 * Turns backend ranking tokens (`MONTHLY`, `JAN - FEB`, ...) into labels that
 * read naturally in the card rows.
 */
export const formatRankingLabel = (value: string): string => {
  const normalized = value
    .trim()
    .replaceAll("_", " ")
    .replaceAll("-", " - ");

  if (!normalized) {
    return "Unnamed";
  }

  return normalized
    .split(" ")
    .filter(Boolean)
    .map(capitalizeWord)
    .join(" ");
};

export const formatSubscriptionCount = (count: number): string =>
  count === 1 ? "subscription" : "subscriptions";
