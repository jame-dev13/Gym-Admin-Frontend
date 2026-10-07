import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { UserForm } from "@/features/user/components/UserForm";

describe("UserForm create mode", () => {
  it("submits a UserRequest payload", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<UserForm mode="create" onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Name input"), "Ada Admin");
    await user.type(screen.getByLabelText("Email input"), "ada@gym.test");
    await user.type(screen.getByLabelText("Password"), "secret12");
    await user.click(screen.getByRole("checkbox", { name: "Admin" }));

    await user.click(screen.getByRole("button", { name: "Create user" }));

    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onSubmit).toHaveBeenCalledWith({
      name: "Ada Admin",
      email: "ada@gym.test",
      password: "secret12",
      authProvider: "LOCAL",
      roles: ["ADMIN"],
    });
  });

  it("shows accessible errors and blocks submit when invalid", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<UserForm mode="create" onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Create user" }));

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("disables fields while pending", () => {
    render(<UserForm mode="create" onSubmit={vi.fn()} isPending />);

    expect(screen.getByLabelText("Name input")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Create user" })).toBeDisabled();
  });
});

describe("UserForm update mode", () => {
  it("prefills only UserUpdateRequest fields and omits password/provider", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <UserForm
        mode="update"
        initialValues={{
          name: "Ada Admin",
          email: "ada@gym.test",
          roles: ["ADMIN"],
        }}
        onSubmit={onSubmit}
      />,
    );

    expect(screen.getByLabelText("Name input")).toHaveValue("Ada Admin");
    expect(screen.queryByLabelText("Password")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("combobox", { name: "Auth provider" }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: "Ada Admin",
      email: "ada@gym.test",
      roles: ["ADMIN"],
    });
  });

  it("renders server errors as an alert", () => {
    render(
      <UserForm
        mode="update"
        onSubmit={vi.fn()}
        serverError="Users could not be saved"
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Users could not be saved",
    );
  });
});
