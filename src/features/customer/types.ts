import type { Identifiable } from "@/types/Types";

export type CustomerCreateRequest = {
  userId: Identifiable;
};

export type CustomerCurrentRequest = {
  phoneContact: string;
};

export type CustomerUpdateRequest = {
  phoneContact: string;
  addressInfo?: AddressInfo;
};

export type CustomerResponse = Identifiable & {
  customerName: string;
  customerEmail: string;
  phoneContact: string;
  addressInfo?: AddressInfo;
};

type AddressInfo = {
  city: string | null;
  locality: string | null;
  street: string | null;
  colony: string | null;
  homeNumber: string | null;
  cp: string | null;
};
