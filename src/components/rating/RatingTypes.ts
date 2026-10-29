export type RatingSize = "sm" | "md" | "lg";

export interface RatingProps {
  /** Controlled normalized rating from 0 to 1. Omit it to use defaultValue. */
  value?: number;
  /** Initial normalized rating for uncontrolled usage. Defaults to 0. */
  defaultValue?: number;
  /** Receives the normalized rating whenever the user picks a new value. */
  onChange?: (value: number) => void;
  /** Name used to submit the rating as part of a native form. */
  name?: string;
  /** Smallest value the pointer and keyboard can produce. Defaults to 0.01. */
  step?: number;
  readOnly?: boolean;
  disabled?: boolean;
  /** Visual size of each star. Defaults to "sm". */
  size?: RatingSize;
  /** Accessible name for the control. Defaults to "Rating". */
  label?: string;
  className?: string;
  id?: string;
}
