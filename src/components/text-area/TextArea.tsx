import React, { type FC } from "react";

export type TextAreaProps = {
  id: string;
  labelClassName?: string;
  textAreaClassName?: string;
  textAreaName: string;
  rows?: number;
  required?: boolean;
  defaultValue?: string;
};

export const TextArea: FC<TextAreaProps> = ({
  id,
  textAreaName,
  defaultValue = "",
  labelClassName = "",
  required = false,
  rows = 4,
  textAreaClassName = "",
}) => {
  return (
    <label
      htmlFor={id}
      className={`flex w-full flex-col gap-2 font-serif ${labelClassName}`}
    >
      <span className={"text-sm font-medium text-text-secondary"}>Comment</span>
      <textarea
        id={id}
        name={textAreaName}
        defaultValue={defaultValue}
        rows={rows}
        required={required}
        className={`w-full resize-y rounded-lg border border-border bg-transparent px-3 py-2 text-sm tracking-wide text-text-primary outline-none transition-colors focus:border-accent focus:ring-0 ${textAreaClassName}`}
      />
    </label>
  );
};
