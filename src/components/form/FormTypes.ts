import type { ReactNode } from "react";

export interface AppFormProps {
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  onChange?: (e: React.FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  id?: string;
  className?: string;
  noValidate?: boolean;
}

export interface FieldsetProps
  extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  legend?: string;
  children: ReactNode;
}

export type PropsWithChildren = { children?: ReactNode };