import { useNotificationConfigHandler } from "@/features/notification/hooks/handlers/useNotificationConfigHandler";
import {
  useActivateNotifications,
  useDeactivateNotifications,
  useSetNotificationRange,
} from "@/features/notification/hooks/useNotification";
import type { NotificationConfigResponse } from "@/features/notification/types";
import { useToastFactory } from "@/hooks/useToastFactory";
import { act, renderHook } from "@testing-library/react";
import type { SubmitEvent } from "react";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

vi.mock("@/features/notification/hooks/useNotification", () => ({
  useActivateNotifications: vi.fn(),
  useDeactivateNotifications: vi.fn(),
  useSetNotificationRange: vi.fn(),
}));

vi.mock("@/hooks/useToastFactory", () => ({
  useToastFactory: vi.fn(),
}));

type MutationMock = {
  mutateAsync: ReturnType<typeof vi.fn>;
  isPending: boolean;
  error: null;
};

const makeMutation = (): MutationMock => ({
  mutateAsync: vi.fn().mockResolvedValue({ payload: undefined, status: 200 }),
  isPending: false,
  error: null,
});

const CURRENT: NotificationConfigResponse = {
  notifiable: true,
  rangeDaysNotification: 4,
  nextNotificationDate: "2026-12-01T10:00:00.000Z",
};

const buildEvent = () =>
  ({ preventDefault: vi.fn() }) as unknown as SubmitEvent<HTMLFormElement>;

let activate: MutationMock;
let deactivate: MutationMock;
let setRange: MutationMock;
let showSuccess: Mock<(message: string) => void>;
let showError: Mock<(message: string) => void>;

beforeEach(() => {
  activate = makeMutation();
  deactivate = makeMutation();
  setRange = makeMutation();
  showSuccess = vi.fn<(message: string) => void>();
  showError = vi.fn<(message: string) => void>();

  vi.mocked(useActivateNotifications).mockReturnValue(
    activate as unknown as ReturnType<typeof useActivateNotifications>,
  );
  vi.mocked(useDeactivateNotifications).mockReturnValue(
    deactivate as unknown as ReturnType<typeof useDeactivateNotifications>,
  );
  vi.mocked(useSetNotificationRange).mockReturnValue(
    setRange as unknown as ReturnType<typeof useSetNotificationRange>,
  );
  vi.mocked(useToastFactory).mockReturnValue({
    showSuccess,
    showError,
    showWarning: vi.fn(),
    showInfo: vi.fn(),
    showDefault: vi.fn(),
  });
});

describe("useNotificationConfigHandler", () => {
  it("activates notifications without touching the range", async () => {
    const onSaved = vi.fn();
    const { result } = renderHook(() => useNotificationConfigHandler());

    await act(async () => {
      await result.current.submit(
        buildEvent(),
        { ...CURRENT, notifiable: false },
        { notifiable: true, numberOfDays: 4 },
        onSaved,
      );
    });

    expect(activate.mutateAsync).toHaveBeenCalledWith(undefined);
    expect(deactivate.mutateAsync).not.toHaveBeenCalled();
    expect(setRange.mutateAsync).not.toHaveBeenCalled();
    expect(showSuccess).toHaveBeenCalledTimes(1);
    expect(onSaved).toHaveBeenCalledTimes(1);
  });

  it("deactivates notifications when the draft turns them off", async () => {
    const { result } = renderHook(() => useNotificationConfigHandler());

    await act(async () => {
      await result.current.submit(
        buildEvent(),
        CURRENT,
        { notifiable: false, numberOfDays: 4 },
      );
    });

    expect(deactivate.mutateAsync).toHaveBeenCalledWith(undefined);
    expect(activate.mutateAsync).not.toHaveBeenCalled();
    expect(setRange.mutateAsync).not.toHaveBeenCalled();
  });

  it("updates only the range when the activation state is unchanged", async () => {
    const { result } = renderHook(() => useNotificationConfigHandler());

    await act(async () => {
      await result.current.submit(
        buildEvent(),
        CURRENT,
        { notifiable: true, numberOfDays: 6 },
      );
    });

    expect(setRange.mutateAsync).toHaveBeenCalledWith({ numberOfDays: 6 });
    expect(activate.mutateAsync).not.toHaveBeenCalled();
    expect(deactivate.mutateAsync).not.toHaveBeenCalled();
  });

  it("applies activation and range changes in sequence", async () => {
    const { result } = renderHook(() => useNotificationConfigHandler());

    await act(async () => {
      await result.current.submit(
        buildEvent(),
        { ...CURRENT, notifiable: false },
        { notifiable: true, numberOfDays: 7 },
      );
    });

    expect(activate.mutateAsync).toHaveBeenCalledWith(undefined);
    expect(setRange.mutateAsync).toHaveBeenCalledWith({ numberOfDays: 7 });
    expect(activate.mutateAsync.mock.invocationCallOrder[0]).toBeLessThan(
      setRange.mutateAsync.mock.invocationCallOrder[0],
    );
  });

  it("reports mutation errors without closing the form", async () => {
    const onSaved = vi.fn();
    setRange.mutateAsync.mockRejectedValueOnce({ message: "Range rejected" });
    const { result } = renderHook(() => useNotificationConfigHandler());

    await act(async () => {
      await result.current.submit(
        buildEvent(),
        CURRENT,
        { notifiable: true, numberOfDays: 6 },
        onSaved,
      );
    });

    expect(showError).toHaveBeenCalledWith("Range rejected");
    expect(showSuccess).not.toHaveBeenCalled();
    expect(onSaved).not.toHaveBeenCalled();
  });
});
