import type { AppFormProps } from "@/types/Props";

export const AppForm = ({
  onSubmit,
  onChange,
  id,
  className = "",
  children,
}: AppFormProps) => {
  return (
    <form
      id={id}
      onSubmit={onSubmit}
      onChange={onChange}
      className={`flex w-full flex-col gap-4 ${className}`}
    >
      {children}
    </form>
  );
};
