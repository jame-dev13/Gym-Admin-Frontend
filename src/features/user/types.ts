import type { Identifiable } from "@/types/Types";

export type UserRequest = Readonly<{
  name: string;
  email: string;
  password: string;
  authProvider: "LOCAL" | "GOOGLE" | "FACEBOOK";
  roles: string[];
}>;

export type UserUpdateRequest = Readonly<{
  name: string;
  email: string;
  roles: string[];
}>;

export type UserResponse = Readonly<
  Identifiable &
    Pick<UserRequest, "name" | "email" | "authProvider" | "roles"> & {
      isCustomer: boolean;
      customerId: Identifiable["id"];
    }
>;
