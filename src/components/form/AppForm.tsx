import type { AppFormProps } from "./FormTypes";

export const AppForm = ({
  onSubmit,
  onChange,
  id,
  className = "",
  noValidate = false,
  children,
}: AppFormProps) => {
  return (
    <form
      id={id}
      onSubmit={onSubmit}
      onChange={onChange}
      noValidate={noValidate || undefined}
      className={`flex w-full flex-col gap-4 ${className}`}
    >
      {children}
    </form>
  );
};
