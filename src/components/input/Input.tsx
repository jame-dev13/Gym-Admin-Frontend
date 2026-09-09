import {
  Info,
  PhoneIcon,
  User,
  UserCircle,
  UserLock,
  EyeClosed,
  Eye,
} from "lucide-react";
import {
  useCallback,
  useId,
  useMemo,
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
  TextInputProps,
} from "@/types/Props";
import { CommandBtn } from "@/components/buttons/Buttons";

export const Input: FC<InputProps> = ({
  labelText = "",
  Icon = Info,
  type = "text",
  className = "",
  ...props
}) => {
  const autoId = useId();

  return (
    <div className="group relative isolate w-full font-serif">
      <input
        type={type}
        id={autoId}
        inputMode="text"
        className={`block py-2.5 px-0 w-full text-left tracking-wide bg-transparent border-0 border-b-2 border-border appearance-none focus:outline-none focus:ring-0 focus:border-accent focus:text-accent peer ${className} invalid:focus:text-rose-500 invalid:focus:border-rose-500`}
        placeholder=" "
        required
        {...props}
      />
      <label
        htmlFor={autoId}
        className={`inline-flex gap-x-1 items-center absolute tracking-wider duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:inset-s peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75
        peer-focus:text-accent peer-invalid:not-focus-visible:text-rose-500 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto`}
      >
        <Icon className="scale-75" />
        {labelText}
      </label>
    </div>
  );
};

export const TextInput: FC<TextInputProps> = (props) => {
  return (
    <Input
      type="text"
      inputMode="text"
      aria-label="Name input"
      labelText={props.labelText ?? "Name"}
      Icon={User}
      {...props}
    />
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

export const PasswordInput = ({ name, className, ...props }: InputProps) => {
  const autoId = useId();
  const [type, setType] = useState<"text" | "password">(() => "password");
  const handleChangeType = useCallback(() => {
    setType((prev) => (prev === "password" ? "text" : "password"));
  }, []);

  const show = type === "text";
  const Icon = useMemo(() => (show ? Eye : EyeClosed), [show]);

  return (
    <>
      <div className="group relative isolate w-full font-serif">
        <input
          type={type}
          id={autoId}
          inputMode="text"
          name={name}
          className={`block py-2.5 px-0 w-full text-left tracking-wide bg-transparent border-0 border-b-2 border-border appearance-none focus:outline-none focus:ring-0 focus:border-accent focus:text-accent peer ${className} invalid:focus:text-rose-500 invalid:focus:border-rose-500`}
          placeholder=" "
          required
          {...props}
        />
        <label
          htmlFor={autoId}
          className={`inline-flex gap-x-1 items-center absolute tracking-wider duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:inset-s peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75
        peer-focus:text-accent peer-invalid:not-focus-visible:text-rose-500 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto`}
        >
          <UserLock className="scale-75" />
          Password
        </label>
        <CommandBtn
          Icon={Icon}
          onClick={handleChangeType}
          aria-label="Button show/hide password"
          className="absolute right-0 top-0"
        >
          {""}
        </CommandBtn>
      </div>
    </>
  );
};
