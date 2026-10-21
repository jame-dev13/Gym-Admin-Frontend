import { SubmitBtn } from "@/components/buttons/Buttons";
import { AppForm } from "@/components/form/AppForm";
import { Fieldset } from "@/components/form/Fieldset";
import {
  getCustomerCreateConfig,
  getCustomerCurrentConfig,
  getCustomerUpdateConfig,
} from "@/features/customer/services/customer-form--config";
import type {
  CustomerCreateRequest,
  CustomerResponse,
  CustomerUpdateRequest,
} from "@/features/customer/types";
import { EditIcon, Save } from "lucide-react";
import React, { useCallback, useMemo, type FC } from "react";

type FormBase = {
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  isPending: boolean;
};

type FormUpdate = {
  mode: "update";
  data: CustomerResponse;
} & FormBase;

type FormCreateSideAdmin = {
  mode: "create";
  side: "admin";
  data: CustomerCreateRequest;
} & FormBase;

type FormCreateSideCurrent = {
  mode: "create";
  side: "current";
} & FormBase;

type FormCreate = FormCreateSideAdmin | FormCreateSideCurrent;

type CustomerFormProps = FormCreate | FormUpdate;

export const CustomerForm: FC<CustomerFormProps> = (props) => {
  const { isPending, onSubmit } = props;
  if (props.mode === "update") {
    return (
      <UpdateForm
        data={props.data}
        isPending={isPending}
        mode={props.mode}
        onSubmit={onSubmit}
      />
    );
  }

  return (
    <>
      {props.side === "admin" ? (
        <CreateForm
          data={props.data}
          isPending={isPending}
          onSubmit={onSubmit}
          mode="create"
          side="admin"
        />
      ) : (
        <CreateForm
          mode="create"
          side="current"
          isPending={isPending}
          onSubmit={onSubmit}
        />
      )}
    </>
  );
};

const UPDATE_CONFIG = getCustomerUpdateConfig();

const UpdateForm: FC<FormUpdate> = ({ onSubmit, isPending, data, mode }) => {
  if (mode !== "update") throw new Error("Mode update is not set.");

  const customer = useMemo<CustomerUpdateRequest>(
    () => ({
      phoneContact: data.contact,
      addressInfo: data.addressInfo,
    }),
    [data],
  );

  return (
    <AppForm onSubmit={onSubmit}>
      <Fieldset legend="Customer Data" key={data.id}>
        {UPDATE_CONFIG.map(({ Field, label, name, "aria-label": al, key }) => {
          return (
            <Field
              name={name}
              labelText={label}
              aria-label={al}
              key={key}
              defaultValue={
                name !== "phoneContact"
                  ? customer?.addressInfo?.[
                      name as keyof CustomerUpdateRequest["addressInfo"]
                    ]
                  : customer.phoneContact
              }
            />
          );
        })}
      </Fieldset>
      <SubmitBtn
        isPending={isPending}
        aria-label="Submit update form button"
        disabled={isPending}
        pendingLabel="Saving changes..."
        Icon={EditIcon}
      >
        Save Changes
      </SubmitBtn>
    </AppForm>
  );
};

const [ADMIN_CREATE_CONFIG, CURRENT_CREATE_CONFIG] = [
  getCustomerCreateConfig(),
  getCustomerCurrentConfig(),
];

const CreateForm: FC<FormCreate> = (props) => {
  const { side, isPending, mode, onSubmit } = props;
  if (mode !== "create") throw new Error("Mode create is not set.");

  const renderButton = useCallback(
    (isPending: boolean) => (
      <SubmitBtn
        Icon={Save}
        aria-label="Save Customer button"
        isPending={isPending}
        disabled={isPending}
        pendingLabel="Saving customer...."
      >
        Save customers
      </SubmitBtn>
    ),
    [],
  );

  if (side === "current") {
    return (
      <AppForm onSubmit={onSubmit}>
        <Fieldset legend="Customer">
          {CURRENT_CREATE_CONFIG.map(
            ({ name, label, key, "aria-label": al, Field }) => (
              <Field
                key={key}
                labelText={label}
                name={name}
                aria-label={al}
                separator="-"
                required
              />
            ),
          )}
        </Fieldset>
        {renderButton(isPending)}
      </AppForm>
    );
  }

  return (
    <AppForm onSubmit={onSubmit} noValidate>
      <Fieldset legend="Customer">
        {ADMIN_CREATE_CONFIG.map(({ Field, key, name }) => {
          const defValue = props.data;
          return (
            <>
              <Field
                key={key}
                name={name}
                value={defValue.userId.id as string | number}
                contentEditable="false"
                readOnly
                type="hidden"
                aria-hidden="true"
                aria-disabled="true"
              />
              <strong className="italic">
                Do you want to create a customer from a user?
              </strong>
            </>
          );
        })}
      </Fieldset>
      {renderButton(isPending)}
    </AppForm>
  );
};
