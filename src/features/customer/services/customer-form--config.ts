import { Input, NumberInput, PhoneInput } from "@/components/input/Input";
import type {
  CustomerCreateRequest,
  CustomerCurrentRequest,
  CustomerUpdateRequest,
} from "@/features/customer/types";
import type { ComponentProps, FC } from "react";

type CustomerFormConfigType = {
  key: string;
  name: string;
  label: string;
  "aria-label"?: string;
  supports: { update: boolean; create: boolean };
  Field: FC<ComponentProps<typeof Input | typeof NumberInput | typeof PhoneInput>>;
};

const customerFormConfig: CustomerFormConfigType[] = [
  {
    key: "contact-key",
    name: "phoneContact",
    label: "Phone Number",
    "aria-label": "Phone Number Input",
    supports: { update: true, create: true },
    Field: PhoneInput,
  },
  {
    key: "city-key",
    name: "city",
    label: "City",
    "aria-label": "City Input",
    supports: { update: true, create: false },
    Field: Input,
  },
  {
    key: "locality-key",
    name: "locality",
    label: "Locality",
    "aria-label": "Locality Input",
    supports: { update: true, create: false },
    Field: Input,
  },
  {
    key: "street-key",
    name: "street",
    label: "Street",
    "aria-label": "Street Input",
    supports: { update: true, create: false },
    Field: Input,
  },
  {
    key: "colony-key",
    name: "colony",
    label: "Colony",
    "aria-label": "Colony Input",
    supports: { update: true, create: false },
    Field: Input,
  },
  {
    key: "home-number-key",
    name: "homeNumber",
    label: "Home Number",
    "aria-label": "Home number Input",
    supports: { update: true, create: false },
    Field: NumberInput,
  },
  {
    key: "cp-key",
    name: "cp",
    label: "CP",
    "aria-label": "CP Input",
    supports: { update: true, create: false },
    Field: NumberInput,
  },
];

export const getCustomerUpdateConfig = () =>
  customerFormConfig
    .filter((v) => v.supports.update)
    .map((v) => ({ ...v, name: v.name as keyof CustomerUpdateRequest }));

export const getCustomerCreateConfig = () =>
  [
    {
      key: "userId-key",
      name: "userId",
      label: "User Id",
      supports: { create: true, update: false },
      Field: Input,
    },
  ].map((v) => ({ ...v, name: v.name as keyof CustomerCreateRequest }));

export const getCustomerCurrentConfig = () =>
  [
    {
      key: "contact-key",
      name: "phoneContact",
      label: "Phone Number",
      "aria-label": "Phone Number Input",
      supports: { update: true, create: true },
      Field: PhoneInput,
    },
  ].map((v) => ({ ...v, name: v.name as keyof CustomerCurrentRequest }));
