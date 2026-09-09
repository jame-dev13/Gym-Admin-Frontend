import { Info, PhoneIcon, UserCircle } from "lucide-react";
import {
  useCallback,
  useId,
  useState,
  type ChangeEvent,
  type FC,
} from "react";
import type {
  DateInputProps,
  EmailInputProps,
  InputProps,
  NumberInputProps,
  PhoneInputProps,
} from "@/types/Props";

export const Input: FC<InputProps> = ({
  labelText = "",
  Icon = Info,
  type = "text",
  className = "",
  ...props
}) => {
  const autoId = useId();

  return (
    <div className="group relative w-full font-serif">
      <input
        type={type}
        id={autoId}
        inputMode="text"
        className={`block py-2.5 px-0 w-full text-sm text-left tracking-wide bg-transparent border-0 border-b-2 border-border appearance-none focus:outline-none focus:ring-0 focus:border-accent focus:text-accent peer ${className} invalid:focus:text-rose-500 invalid:focus:border-rose-500`}
        placeholder=" "
        {...props}
      />
      <label
        htmlFor={autoId}
        className={`inline-flex gap-x-1 items-center absolute tracking-wider duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:inset-s peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75
        peer-focus:text-accent peer-invalid:not-focus-visible:text-rose-500 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto`}
      >
        <Icon className="text-sm scale-75" />
        {labelText}
      </label>
    </div>
  );
};

export const EmailInput: FC<EmailInputProps> = (props) => {
  return (
    <Input
      type="email"
      inputMode="email"
      aria-label="Email input"
      labelText={props.labelText ?? "Email"}
      Icon={UserCircle}
      {...props}
    />
  );
};

export const DateInput: FC<DateInputProps> = (props) => {
  return <Input type="date" {...props} />;
};

export const NumberInput: FC<NumberInputProps> = (props) => {
  return (
    <Input
      type="number"
      inputMode="decimal"
      labelText={props.labelText ?? "Number"}
      {...props}
    />
  );
};

const formatPhone = (raw: string, separator: string) => {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (!digits) return "";
  if (digits.length <= 3) return digits;
  if (digits.length <= 6)
    return `${digits.slice(0, 3)}${separator}${digits.slice(3)}`;
  return `${digits.slice(0, 3)}${separator}${digits.slice(3, 6)}${separator}${digits.slice(6)}`;
};

export const PhoneInput = ({
  defaultValue = "",
  separator = " ",
  onChange,
  ...rest
}: PhoneInputProps) => {
  const [value, setValue] = useState(() =>
    formatPhone(String(defaultValue), separator),
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const next = formatPhone(e.currentTarget.value, separator);
      e.currentTarget.value = next;
      setValue(next);
      onChange?.(e);
    },
    [onChange, separator],
  );

  return (
    <Input
      type="tel"
      inputMode="tel"
      Icon={PhoneIcon}
      labelText="Phone"
      autoComplete=""
      pattern="[0-9]{3} [0-9]{3} [0-9]{4}"
      maxLength={13}
      value={value}
      aria-label="Phone input."
      onChange={handleChange}
      {...rest}
    />
  );
};
