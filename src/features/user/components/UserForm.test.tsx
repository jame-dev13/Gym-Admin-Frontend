import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { UserForm } from "@/features/user/components/UserForm";

type SubmitCapture = {
  preventDefault: () => void;
  formData: FormData | null;
};

function createSubmitMock(
  capture: SubmitCapture,
  onSubmitFn?: (formData: FormData) => void
) {
  return vi.fn().mockImplementation((e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    capture.preventDefault = e.preventDefault;
    const form = e.currentTarget as HTMLFormElement;
    capture.formData = new FormData(form);
    onSubmitFn?.(capture.formData);
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
  it("renders all create fields: name, email, password, roles", () => {
    const capture: SubmitCapture = { preventDefault: vi.fn(), formData: null };
    render(<UserForm onSubmit={createSubmitMock(capture)} isPending={false} />);

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.queryByLabelText("AuthProvider")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Roles")).toBeInTheDocument();
  });

  it("submits FormData with all create fields", async () => {
    const capture: SubmitCapture = { preventDefault: vi.fn(), formData: null };
    const user = userEvent.setup();
    render(<UserForm onSubmit={createSubmitMock(capture)} isPending={false} />);

    await user.type(screen.getByLabelText("Name"), "Ada Admin");
    await user.type(screen.getByLabelText("Email"), "ada@gym.test");
    await user.type(screen.getByLabelText("Password"), "secret12");
    await user.selectOptions(screen.getByLabelText("Roles"), "ADMIN");

    await user.click(screen.getByRole("button", { name: "Submit User create form button" }));

    expect(capture.formData).not.toBeNull();
    const data = formDataToObject(capture.formData!);
    expect(data).toEqual({
      name: "Ada Admin",
      email: "ada@gym.test",
      password: "secret12",
      roles: "ADMIN",
    });
  });

  it("disables submit button while pending (fields remain enabled)", () => {
    render(<UserForm onSubmit={vi.fn()} isPending={true} />);

    expect(screen.getByLabelText("Name")).not.toBeDisabled();
    expect(screen.getByLabelText("Email")).not.toBeDisabled();
    expect(screen.getByLabelText("Password")).not.toBeDisabled();
    expect(screen.getByLabelText("Roles")).not.toBeDisabled();
    expect(screen.getByRole("button", { name: "Submit User create form button" })).toBeDisabled();
  });
});

describe("UserForm update mode", () => {
  it("renders only updatable fields: name, email, roles (no password, no authProvider)", () => {
    const capture: SubmitCapture = { preventDefault: vi.fn(), formData: null };
    render(
      <UserForm
        userData={{
          id: "uuid-23e03f",
          name: "Ada Admin",
          email: "ada@gym.test",
          authProvider: "LOCAL",
          roles: ["ADMIN"],
          customerId: null,
          isCustomer: false,
        }}
        isPending={false}
        onSubmit={createSubmitMock(capture)}
      />,
    );

    expect(screen.getByLabelText("Name")).toHaveValue("Ada Admin");
    expect(screen.getByLabelText("Email")).toHaveValue("ada@gym.test");
    expect(screen.queryByLabelText("Password")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("AuthProvider")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Roles")).toBeInTheDocument();
  });

  it("shows placeholder for roles when defaultValue doesn't match any option", () => {
    render(
      <UserForm
        userData={{
          id: "uuid-23e03f",
          name: "Ada Admin",
          email: "ada@gym.test",
          authProvider: "LOCAL",
          roles: ["ADMIN", "USER"],
          customerId: null,
          isCustomer: false,
        }}
        isPending={false}
        onSubmit={vi.fn()}
      />,
    );

    const rolesSelect = screen.getByLabelText("Roles") as HTMLSelectElement;
    expect(rolesSelect.value).toBe("");
  });

  it("submits roles as comma-separated string after user selection", async () => {
    const capture: SubmitCapture = { preventDefault: vi.fn(), formData: null };
    const user = userEvent.setup();
    render(
      <UserForm
        userData={{
          id: "uuid-23e03f",
          name: "Ada Admin",
          email: "ada@gym.test",
          authProvider: "LOCAL",
          roles: ["ADMIN", "USER"],
          customerId: null,
          isCustomer: false,
        }}
        isPending={false}
        onSubmit={createSubmitMock(capture)}
      />,
    );

    await user.selectOptions(screen.getByLabelText("Roles"), "ADMIN");
    await user.click(screen.getByRole("button", { name: "Submit User update form button" }));

    expect(capture.formData).not.toBeNull();
    const data = formDataToObject(capture.formData!);
    expect(data.roles).toBe("ADMIN");
  });

  it("submits FormData with only updatable fields", async () => {
    const capture: SubmitCapture = { preventDefault: vi.fn(), formData: null };
    const user = userEvent.setup();
    render(
      <UserForm
        userData={{
          id: "uuid-23e03f",
          name: "Ada Admin",
          email: "ada@gym.test",
          authProvider: "LOCAL",
          roles: ["ADMIN"],
          customerId: null,
          isCustomer: false,
        }}
        isPending={false}
        onSubmit={createSubmitMock(capture)}
      />,
    );

    await user.clear(screen.getByLabelText("Name"));
    await user.type(screen.getByLabelText("Name"), "Ada Updated");
    await user.selectOptions(screen.getByLabelText("Roles"), "USER");

    await user.click(screen.getByRole("button", { name: "Submit User update form button" }));

    expect(capture.formData).not.toBeNull();
    const data = formDataToObject(capture.formData!);
    expect(data).toEqual({
      name: "Ada Updated",
      email: "ada@gym.test",
      roles: "USER",
    });
    expect(data).not.toHaveProperty("password");
    expect(data).not.toHaveProperty("authProvider");
  });

  it("disables submit button while pending (fields remain enabled)", () => {
    render(
      <UserForm
        userData={{
          id: "uuid-23e03f",
          name: "Ada Admin",
          email: "ada@gym.test",
          authProvider: "LOCAL",
          roles: ["ADMIN"],
          customerId: null,
          isCustomer: false,
        }}
        isPending={true}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Name")).not.toBeDisabled();
    expect(screen.getByLabelText("Email")).not.toBeDisabled();
    expect(screen.getByLabelText("Roles")).not.toBeDisabled();
    expect(screen.getByRole("button", { name: "Submit User update form button" })).toBeDisabled();
  });

  it("shows correct button text for each mode", () => {
    const { rerender } = render(
      <UserForm onSubmit={vi.fn()} isPending={false} />
    );
    expect(screen.getByText("Create user")).toBeInTheDocument();

    rerender(
      <UserForm
        userData={{
          id: "uuid-23e03f",
          name: "Ada",
          email: "ada@gym.test",
          authProvider: "LOCAL",
          roles: ["ADMIN"],
          customerId: null,
          isCustomer: false,
        }}
        isPending={false}
        onSubmit={vi.fn()}
      />,
    );
    expect(screen.getByText("Save changes")).toBeInTheDocument();
  });
});