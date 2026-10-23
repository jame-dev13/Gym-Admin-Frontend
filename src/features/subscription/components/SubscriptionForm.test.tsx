import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { SubmitEvent } from "react";
import { SubscriptionForm } from "@/features/subscription/components/SubscriptionForm";
import type { SubscriptionResponse } from "@/features/subscription/types";

const EMAIL_LABEL = "Customer email input field.";
const MEMBERSHIP_LABEL = "Membership selector.";
const CREATE_SUBMIT = "Subscription create form submit button";
const UPDATE_SUBMIT = "Subscription edit form submit button";

function buildSubscription(
  overrides: Partial<SubscriptionResponse> = {},
): SubscriptionResponse {
  return {
    id: "uuid-sub-01",
    customerEmail: "ada@gym.test",
    membership: "MONTHLY",
    price: 300,
    periods: [{ periodType: "MONTH", periodStr: "October" }],
    status: "NOT_PAID",
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
    obj[key] = value;
  }
  return obj;
}

describe("SubscriptionForm create mode", () => {
  it("renders only the subscription request fields", () => {
    render(
      <SubscriptionForm mode="create" onSubmit={vi.fn()} isPending={false} />,
    );

    expect(
      screen.getByRole("group", { name: "New Subscription" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(EMAIL_LABEL)).toBeInTheDocument();
    expect(screen.getByLabelText(MEMBERSHIP_LABEL)).toBeInTheDocument();
    expect(screen.queryByLabelText("Status")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Price")).not.toBeInTheDocument();
  });

  it("submits the customer email and membership", async () => {
    const capture: { formData: FormData | null } = { formData: null };
    const user = userEvent.setup();
    render(
      <SubscriptionForm
        mode="create"
        onSubmit={createSubmitMock(capture)}
        isPending={false}
      />,
    );

    await user.type(screen.getByLabelText(EMAIL_LABEL), "ada@gym.test");
    await user.selectOptions(screen.getByLabelText(MEMBERSHIP_LABEL), "ANNUAL");
    await user.click(screen.getByRole("button", { name: CREATE_SUBMIT }));

    expect(capture.formData).not.toBeNull();
    expect(formDataToObject(capture.formData!)).toEqual({
      customerEmail: "ada@gym.test",
      membership: "ANNUAL",
    });
  });

  it("disables the submit button while pending", () => {
    render(
      <SubscriptionForm mode="create" onSubmit={vi.fn()} isPending={true} />,
    );

    const submit = screen.getByRole("button", { name: CREATE_SUBMIT });
    expect(submit).toBeDisabled();
    expect(submit).toHaveAttribute("aria-busy", "true");
  });

  it("renders a confirmation and gates submission until it is enabled", () => {
    const { rerender } = render(
      <SubscriptionForm
        mode="create"
        onSubmit={vi.fn()}
        isPending={false}
        submitDisabled
        confirmation={<p>Payment confirmation</p>}
      />,
    );

    expect(screen.getByText("Payment confirmation")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: CREATE_SUBMIT })).toBeDisabled();

    rerender(
      <SubscriptionForm
        mode="create"
        onSubmit={vi.fn()}
        isPending={false}
        confirmation={<p>Payment confirmation</p>}
      />,
    );

    expect(screen.getByRole("button", { name: CREATE_SUBMIT })).toBeEnabled();
  });
});

describe("SubscriptionForm update mode", () => {
  it("prefills the subscription data", () => {
    render(
      <SubscriptionForm
        mode="update"
        data={buildSubscription()}
        onSubmit={vi.fn()}
        isPending={false}
      />,
    );

    expect(
      screen.getByRole("group", { name: "Edit Subscription" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(EMAIL_LABEL)).toHaveValue("ada@gym.test");
    expect(screen.getByLabelText(MEMBERSHIP_LABEL)).toHaveValue("MONTHLY");
  });

  it("remounts the fields when the subscription id changes", () => {
    const { rerender } = render(
      <SubscriptionForm
        mode="update"
        data={buildSubscription()}
        onSubmit={vi.fn()}
        isPending={false}
      />,
    );

    rerender(
      <SubscriptionForm
        mode="update"
        data={buildSubscription({
          id: "uuid-sub-02",
          customerEmail: "grace@gym.test",
          membership: "ANNUAL",
        })}
        onSubmit={vi.fn()}
        isPending={false}
      />,
    );

    expect(screen.getByLabelText(EMAIL_LABEL)).toHaveValue("grace@gym.test");
    expect(screen.getByLabelText(MEMBERSHIP_LABEL)).toHaveValue("ANNUAL");
  });

  it("submits the prefilled values", async () => {
    const capture: { formData: FormData | null } = { formData: null };
    const user = userEvent.setup();
    render(
      <SubscriptionForm
        mode="update"
        data={buildSubscription()}
        onSubmit={createSubmitMock(capture)}
        isPending={false}
      />,
    );

    await user.click(screen.getByRole("button", { name: UPDATE_SUBMIT }));

    expect(capture.formData).not.toBeNull();
    expect(formDataToObject(capture.formData!)).toEqual({
      customerEmail: "ada@gym.test",
      membership: "MONTHLY",
    });
  });
});
