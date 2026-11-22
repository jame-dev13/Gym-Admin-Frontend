import { screen, within } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import { ModalProvider } from "@/context/ModalProvider";
import type { PaymentResponse } from "@/features/payment/types";
import type { SubscriptionResponse } from "@/features/subscription/types";
import { server } from "@/test/mocks/server";
import { renderWithProviders } from "@/test/test-utils";
import HomeOverview from "./HomeOverview";

const BASE = import.meta.env.VITE_BASE;
const SUBSCRIPTION_CURRENT = `${BASE}${import.meta.env.VITE_SUBSCRIPTION_CURRENT_V1}`;
const PAYMENTS_CURRENT = `${BASE}${import.meta.env.VITE_CURRENT_PAYMENTS_V1}`;

const subscription: SubscriptionResponse = {
  id: 1,
  customerEmail: "angel@mail.com",
  membership: "MONTHLY",
  price: 300,
  periods: [{ periodType: "MONTHLY", periodStr: "Every month" }],
  status: "PAID",
};

const payment: PaymentResponse = {
  id: 1,
  amount: 300,
  status: "COMPLETED",
  paymentMethod: "ELECTRONIC",
  createdAt: "2026-11-19T10:00:00.000Z",
};

const renderOverview = () =>
  renderWithProviders(
    <ModalProvider>
      <HomeOverview />
    </ModalProvider>,
    { route: "/home" },
  );

describe("HomeOverview", () => {
  beforeEach(() => {
    server.use(
      http.get(`${SUBSCRIPTION_CURRENT}/exists`, () =>
        HttpResponse.json({ exists: true }),
      ),
      http.get(SUBSCRIPTION_CURRENT, () => HttpResponse.json(subscription)),
      http.get(PAYMENTS_CURRENT, () =>
        HttpResponse.json({
          content: [payment],
          page: { size: 1, number: 0, totalElements: 1, totalPages: 1 },
        }),
      ),
    );
  });

  it("shows the membership showcase when there is no subscription", async () => {
    server.use(
      http.get(`${SUBSCRIPTION_CURRENT}/exists`, () =>
        HttpResponse.json({ exists: false }),
      ),
    );

    renderOverview();

    expect(
      await screen.findByRole("heading", { name: "Choose your membership" }),
    ).toBeInTheDocument();
  });

  it("shows the composed overview when a subscription exists", async () => {
    renderOverview();

    expect(
      await screen.findByRole("navigation", {
        name: "Home overview sections",
      }),
    ).toBeInTheDocument();
    const lastPaymentSection = await screen.findByRole("region", {
      name: "Last payment",
    });
    expect(
      await within(lastPaymentSection).findByText("Completed"),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", { name: "My payments" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", { name: "Current subscription" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", { name: "Monthly" }),
    ).toBeInTheDocument();
  });
});
