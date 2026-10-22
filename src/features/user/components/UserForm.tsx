import React, { Fragment, type FC } from "react";
import { UserPlus, Save } from "lucide-react";
import { AppForm } from "@/components/form/AppForm";
import { Fieldset } from "@/components/form/Fieldset";
import { SubmitBtn } from "@/components/buttons/Buttons";
import type { UserResponse, UserUpdateRequest } from "@/features/user/types";
import { getUserFormConfig } from "@/features/user/services/user-form-config";

type FormBase = {
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  isPending: boolean;
};
type CreateForm = FormBase & {
  mode: "create";
};

type UpdateForm = FormBase & { mode: "update"; data: UserResponse };

export type UserFormProps = CreateForm | UpdateForm;

const { create: createConfig, update: updateConfig } = getUserFormConfig();

export const UserForm = (props: UserFormProps) => {
  const { isPending, mode, onSubmit } = props;

  if (mode === "create")
    return (
      <UserCreateFormTemplate
        isPending={isPending}
        mode={mode}
        onSubmit={onSubmit}
      />
    );

  const { data } = props;

  return (
    <UserUpdateFormTemplate
      data={data}
      isPending={isPending}
      mode={mode}
      onSubmit={onSubmit}
    />
  );
};

const UserCreateFormTemplate: FC<CreateForm> = ({
  isPending,
  mode,
  onSubmit,
}) => {
  if (mode !== "create") throw new Error("Create mode is unset.");
  return (
    <AppForm onSubmit={onSubmit}>
      <Fieldset legend="New User">
        {createConfig.map(({ key, label, name, ariaLabel, Field }) => (
          <Fragment key={key}>
            <Field
              label={label}
              name={name}
              aria-label={ariaLabel}
              className="mb-1"
            />
          </Fragment>
        ))}
      </Fieldset>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <SubmitBtn
          Icon={UserPlus}
          aria-label="User create form submit button"
          pendingLabel="Creating user...."
          isPending={isPending}
        >
          Create User
        </SubmitBtn>
      </div>
    </AppForm>
  );
};

const UserUpdateFormTemplate: FC<UpdateForm> = ({
  isPending,
  mode,
  data,
  onSubmit,
}) => {
  if (mode !== "update") throw new Error("Update mode is unset.");

  const user: UserUpdateRequest = {
    name: data.name,
    email: data.email,
    roles: data.role,
  };

  return (
    <AppForm onSubmit={onSubmit}>
      <Fieldset legend="Edit User" key={data.id}>
        {updateConfig.map(({ key, label, name, ariaLabel, Field }) => {
          const value = resolveValue(user[name]);
          return (
            <Fragment key={key}>
              <Field
                label={label}
                name={name}
                defaultValue={value}
                aria-label={ariaLabel}
                className="mb-1"
              />
            </Fragment>
          );
        })}
      </Fieldset>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <SubmitBtn
          Icon={Save}
          aria-label="User edit form submit button"
          pendingLabel="Editing user...."
          isPending={isPending}
        >
          Edit User
        </SubmitBtn>
      </div>
    </AppForm>
  );
};

const resolveValue = (value: UserUpdateRequest[keyof UserUpdateRequest]) =>
  Array.isArray(value) ? (value[0] ?? "") : value;
