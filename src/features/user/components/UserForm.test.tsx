import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { SubmitEvent } from "react";
import { UserForm } from "@/features/user/components/UserForm";
import type { UserResponse } from "@/features/user/types";

const NAME_LABEL = "Name input field.";
const EMAIL_LABEL = "Email input field.";
const PASSWORD_LABEL = "Password input field.";
const ROLES_LABEL = "Roles";
const CREATE_SUBMIT = "User create form submit button";
const UPDATE_SUBMIT = "User edit form submit button";

function buildUser(overrides: Partial<UserResponse> = {}): UserResponse {
  return {
    id: "uuid-23e03f",
    name: "Ada Admin",
    email: "ada@gym.test",
    authProvider: "LOCAL",
    role: ["ADMIN"],
    customerId: null,
    isCustomer: false,
    ...overrides,
  };
}

function createSubmitMock(capture: { formData: FormData | null }) {
  return vi.fn((e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    capture.formData = new FormData(e.currentTarget);
  });
}

function formDataToObject(fd: FormData): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const [key, value] of fd.entries()) {
    if (obj[key] === undefined) {
      obj[key] = value;
    } else if (Array.isArray(obj[key])) {
      (obj[key] as unknown[]).push(value);
    } else {
      obj[key] = [obj[key], value];
    }
  }
  return obj;
}

describe("UserForm create mode", () => {
  it("renders the create fields and legend", () => {
    render(
      <UserForm mode="create" onSubmit={vi.fn()} isPending={false} />,
    );

    expect(screen.getByRole("group", { name: "New User" })).toBeInTheDocument();
    expect(screen.getByLabelText(NAME_LABEL)).toBeInTheDocument();
    expect(screen.getByLabelText(EMAIL_LABEL)).toBeInTheDocument();
    expect(screen.getByLabelText(PASSWORD_LABEL)).toBeInTheDocument();
    expect(screen.getByLabelText(ROLES_LABEL)).toBeInTheDocument();
    expect(screen.queryByLabelText("AuthProvider")).not.toBeInTheDocument();
  });

  it("submits FormData with all create fields", async () => {
    const capture: { formData: FormData | null } = { formData: null };
    const user = userEvent.setup();
    render(
      <UserForm
        mode="create"
        onSubmit={createSubmitMock(capture)}
        isPending={false}
      />,
    );

    await user.type(screen.getByLabelText(NAME_LABEL), "Ada Admin");
    await user.type(screen.getByLabelText(EMAIL_LABEL), "ada@gym.test");
    await user.type(screen.getByLabelText(PASSWORD_LABEL), "secret12");
    await user.selectOptions(screen.getByLabelText(ROLES_LABEL), "ADMIN");

    await user.click(screen.getByRole("button", { name: CREATE_SUBMIT }));

    expect(capture.formData).not.toBeNull();
    expect(formDataToObject(capture.formData!)).toEqual({
      name: "Ada Admin",
      email: "ada@gym.test",
      password: "secret12",
      roles: "ADMIN",
    });
  });

  it("disables the submit button while pending but keeps fields enabled", () => {
    render(<UserForm mode="create" onSubmit={vi.fn()} isPending={true} />);

    expect(screen.getByLabelText(NAME_LABEL)).not.toBeDisabled();
    expect(screen.getByLabelText(EMAIL_LABEL)).not.toBeDisabled();
    expect(screen.getByLabelText(PASSWORD_LABEL)).not.toBeDisabled();
    expect(screen.getByLabelText(ROLES_LABEL)).not.toBeDisabled();

    const submit = screen.getByRole("button", { name: CREATE_SUBMIT });
    expect(submit).toBeDisabled();
    expect(submit).toHaveAttribute("aria-busy", "true");
  });

  it("renders the create submit button label", () => {
    render(
      <UserForm mode="create" onSubmit={vi.fn()} isPending={false} />,
    );

    expect(screen.getByRole("button", { name: CREATE_SUBMIT })).toHaveTextContent(
      "Create User",
    );
  });
});

describe("UserForm update mode", () => {
  it("prefills name, email and the current role from the fetched user", () => {
    render(
      <UserForm
        mode="update"
        data={buildUser()}
        isPending={false}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(NAME_LABEL)).toHaveValue("Ada Admin");
    expect(screen.getByLabelText(EMAIL_LABEL)).toHaveValue("ada@gym.test");
    expect(screen.getByLabelText(ROLES_LABEL)).toHaveValue("ADMIN");
  });

  it("renders only updatable fields (no password or authProvider)", () => {
    render(
      <UserForm
        mode="update"
        data={buildUser()}
        isPending={false}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByRole("group", { name: "Edit User" })).toBeInTheDocument();
    expect(screen.getByLabelText(NAME_LABEL)).toBeInTheDocument();
    expect(screen.getByLabelText(EMAIL_LABEL)).toBeInTheDocument();
    expect(screen.getByLabelText(ROLES_LABEL)).toBeInTheDocument();
    expect(screen.queryByLabelText(PASSWORD_LABEL)).not.toBeInTheDocument();
    expect(screen.queryByLabelText("AuthProvider")).not.toBeInTheDocument();
  });

  it("prefills the first role when the user has multiple roles", () => {
    render(
      <UserForm
        mode="update"
        data={buildUser({ role: ["ADMIN", "USER"] })}
        isPending={false}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(ROLES_LABEL)).toHaveValue("ADMIN");
  });

  it("submits only updatable fields, preserving the prefilled role", async () => {
    const capture: { formData: FormData | null } = { formData: null };
    const user = userEvent.setup();
    render(
      <UserForm
        mode="update"
        data={buildUser()}
        isPending={false}
        onSubmit={createSubmitMock(capture)}
      />,
    );

    await user.clear(screen.getByLabelText(NAME_LABEL));
    await user.type(screen.getByLabelText(NAME_LABEL), "Ada Updated");

    await user.click(screen.getByRole("button", { name: UPDATE_SUBMIT }));

    expect(capture.formData).not.toBeNull();
    const data = formDataToObject(capture.formData!);
    expect(data).toEqual({
      name: "Ada Updated",
      email: "ada@gym.test",
      roles: "ADMIN",
    });
    expect(data).not.toHaveProperty("password");
    expect(data).not.toHaveProperty("authProvider");
  });

  it("submits the role selected by the user", async () => {
    const capture: { formData: FormData | null } = { formData: null };
    const user = userEvent.setup();
    render(
      <UserForm
        mode="update"
        data={buildUser()}
        isPending={false}
        onSubmit={createSubmitMock(capture)}
      />,
    );

    await user.selectOptions(screen.getByLabelText(ROLES_LABEL), "USER");
    await user.click(screen.getByRole("button", { name: UPDATE_SUBMIT }));

    expect(capture.formData).not.toBeNull();
    expect(formDataToObject(capture.formData!).roles).toBe("USER");
  });

  it("disables the submit button while pending but keeps fields enabled", () => {
    render(
      <UserForm
        mode="update"
        data={buildUser()}
        isPending={true}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(NAME_LABEL)).not.toBeDisabled();
    expect(screen.getByLabelText(EMAIL_LABEL)).not.toBeDisabled();
    expect(screen.getByLabelText(ROLES_LABEL)).not.toBeDisabled();

    const submit = screen.getByRole("button", { name: UPDATE_SUBMIT });
    expect(submit).toBeDisabled();
    expect(submit).toHaveAttribute("aria-busy", "true");
  });

  it("remounts the fields when the user id changes", () => {
    const { rerender } = render(
      <UserForm
        mode="update"
        data={buildUser()}
        isPending={false}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(NAME_LABEL)).toHaveValue("Ada Admin");

    rerender(
      <UserForm
        mode="update"
        data={buildUser({ id: "uuid-other", name: "Grace Admin" })}
        isPending={false}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(NAME_LABEL)).toHaveValue("Grace Admin");
  });
});

describe("UserForm mode switching", () => {
  it("renders the legend and submit label for each mode", () => {
    const { rerender } = render(
      <UserForm mode="create" onSubmit={vi.fn()} isPending={false} />,
    );

    expect(screen.getByRole("group", { name: "New User" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: CREATE_SUBMIT }),
    ).toHaveTextContent("Create User");

    rerender(
      <UserForm
        mode="update"
        data={buildUser()}
        isPending={false}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByRole("group", { name: "Edit User" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: UPDATE_SUBMIT }),
    ).toHaveTextContent("Edit User");
  });
});
