import { getPaymentTableConfig } from "@/features/payment/services/payment-table-config";

describe("payment table config", () => {
  it("does not expose the payment identifier as a column", () => {
    const config = getPaymentTableConfig();

    expect(config.columns.map((column) => column.key)).not.toContain("id");
  });

  it("configures the payment sortable properties and compact striped table", () => {
    const config = getPaymentTableConfig();

    expect(config.sort?.properties).toEqual([
      "status",
      "method",
      "amount",
      "createdAt",
    ]);
    expect(config.tableOptions).toMatchObject({
      size: "sm",
      striped: true,
    });
  });
});
