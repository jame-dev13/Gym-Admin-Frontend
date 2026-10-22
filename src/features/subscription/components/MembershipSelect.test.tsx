import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MembershipSelect } from "@/features/subscription/components/MembershipSelect";

const MEMBERSHIPS = [
  ["Biweekly", "BIWEEKLY"],
  ["Monthly", "MONTHLY"],
  ["Quarterly", "QUARTERLY"],
  ["Annual", "ANNUAL"],
] as const;

describe("MembershipSelect", () => {
  it("renders every membership option", () => {
    render(<MembershipSelect name="membership" />);

    const select = screen.getByLabelText("Membership");
    expect(select).toHaveValue("");

    for (const [label, value] of MEMBERSHIPS) {
      expect(screen.getByRole("option", { name: label })).toHaveValue(value);
    }
  });

  it("stores the selected membership value", async () => {
    const user = userEvent.setup();
    render(<MembershipSelect name="membership" />);

    const select = screen.getByLabelText("Membership");
    await user.selectOptions(select, "QUARTERLY");

    expect(select).toHaveValue("QUARTERLY");
  });

  it("prefills the provided default membership", () => {
    render(
      <MembershipSelect name="membership" defaultValue="ANNUAL" />,
    );

    expect(screen.getByLabelText("Membership")).toHaveValue("ANNUAL");
  });
});
