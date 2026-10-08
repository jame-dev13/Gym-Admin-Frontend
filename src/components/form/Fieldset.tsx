import type { FieldsetProps } from "./FormTypes";

export const Fieldset = ({ legend, children, ...rest }: FieldsetProps) => {
  return (
    <fieldset
      {...rest}
      className="flex min-h-fit w-full flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-surface-over px-4 py-3.5 transition-colors focus-within:border-border-emphasis"
    >
      {legend ? (
        <legend className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-serif">
          {legend}
        </legend>
      ) : null}
      <section className="flex w-full flex-col shrink gap-3">
        {children}
      </section>
    </fieldset>
  );
};
