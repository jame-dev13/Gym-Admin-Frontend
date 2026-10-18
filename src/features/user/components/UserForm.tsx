import React, { Fragment, useMemo } from "react";
import { UserPlus, Save } from "lucide-react";
import { AppForm } from "@/components/form/AppForm";
import { Fieldset } from "@/components/form/Fieldset";
import { SubmitBtn } from "@/components/buttons/Buttons";
import type { UserResponse, UserUpdateRequest } from "@/features/user/types";
import { getUserFormConfig } from "@/features/user/services/UserFormConfig";

export type UserFormProps = {
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  isPending: boolean;
  userData?: UserResponse;
};

const { create: createConfig, update: updateConfig } = getUserFormConfig();

export const UserForm = ({ onSubmit, userData, isPending }: UserFormProps) => {
  const isEditMode = !!userData;
  const user = useMemo<UserUpdateRequest | undefined>(() => {
    if (!userData) return undefined;
    return {
      name: userData.name,
      email: userData.email,
      roles: userData.roles,
    };
  }, [userData]);

  const config = isEditMode ? updateConfig : createConfig;
  return (
    <AppForm
      onSubmit={onSubmit}
      noValidate
      className="gap-3"
      key={userData?.id ?? "Creating-key"}
    >
      <Fieldset legend={!isEditMode ? "New user" : "Edit user"}>
        {config.map(({ key, ariaLabel, label, name, Field }) => {
          return (
            <Fragment key={key}>
              <Field
                label={label}
                name={name}
                defaultValue={
                  isEditMode
                    ? resolveValue(
                        user?.[name as keyof UserUpdateRequest] ?? "",
                      )
                    : ""
                }
                aria-label={ariaLabel}
                className="mb-2"
              />
            </Fragment>
          );
        })}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <SubmitBtn
            Icon={!isEditMode ? UserPlus : Save}
            aria-label={`Submit ${isEditMode ? "User update form button" : "User create form button"}`}
            isPending={isPending}
          >
            {!isEditMode ? "Create user" : "Save changes"}
          </SubmitBtn>
        </div>
      </Fieldset>
    </AppForm>
  );
};

const resolveValue = (value: string | string[]) => {
  return typeof value === "string" ? String(value) : value.join(", ");
};
