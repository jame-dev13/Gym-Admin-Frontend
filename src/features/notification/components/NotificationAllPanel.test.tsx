import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NotificationAllPanel } from "@/features/notification/components/NotificationAllPanel";
import { useNotifyAllHandler } from "@/features/notification/hooks/useNotifyAllHandler";
import { useGetNotificationAvailability } from "@/features/notification/hooks/useNotification";
import type { NotificationSummary } from "@/features/notification/types";

vi.mock("@/features/notification/hooks/useNotification", () => ({
  useGetNotificationAvailability: vi.fn(),
  useTriggerNotificationAll: vi.fn(),
}));

vi.mock("@/features/notification/hooks/useNotifyAllHandler", () => ({
  useNotifyAllHandler: vi.fn(),
}));

const refetch = vi.fn();
const submit = vi.fn((event: React.SubmitEvent<HTMLFormElement>) =>
  event.preventDefault(),
);

const mockAvailability = (summary: NotificationSummary) => {
  vi.mocked(useGetNotificationAvailability).mockReturnValue({
    data: summary,
    isPending: false,
    isLoading: false,
    isError: false,
    error: null,
    refetch,
  } as unknown as ReturnType<typeof useGetNotificationAvailability>);
};

describe("NotificationAllPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNotifyAllHandler).mockReturnValue({
      submit,
      isPending: false,
      error: null,
    });
  });

  it("shows the notification form when notifications are available", async () => {
    const user = userEvent.setup();
    mockAvailability({ availability: "AVAILABLE", ttl: -1 });

    render(<NotificationAllPanel />);

    expect(screen.getByText("AVAILABLE")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Notify all customers" }),
    );

    expect(submit).toHaveBeenCalledTimes(1);
  });

  it("shows the lock message and countdown while notifications are locked", () => {
    mockAvailability({ availability: "UNDER_LOCK", ttl: 80_000 });

    render(<NotificationAllPanel />);

    expect(screen.getByText("UNDER_LOCK")).toBeInTheDocument();
    expect(
      screen.getByText(/A notification process is already running/i),
    ).toBeInTheDocument();
    expect(screen.getByText("01:20")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Notify all customers" }),
    ).not.toBeInTheDocument();
  });
});
