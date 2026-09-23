import { Table } from "@/components/table/Table";
import type { Column } from "@/types/Types";

type Member = {
  id: number;
  name: string;
  plan: string | null;
  sessions: number;
  status: "active" | "paused" | "expired";
};

const members: Member[] = [
  { id: 1, name: "Ada Lovelace", plan: "Pro", sessions: 12, status: "active" },
  { id: 2, name: "Grace Hopper", plan: null, sessions: 8, status: "paused" },
  { id: 3, name: "Katherine Johnson", plan: "Basic", sessions: 21, status: "active" },
  { id: 4, name: "Margaret Hamilton", plan: "Pro", sessions: 0, status: "expired" },
];

const basicColumns: Column<Member>[] = [
  { key: "name", header: "Name" },
  { key: "plan", header: "Plan" },
  { key: "sessions", header: "Sessions", align: "right", width: "8rem" },
];

const statusPill = (status: Member["status"]) => {
  const styles: Record<Member["status"], string> = {
    active: "bg-success/10 text-success",
    paused: "bg-warning/10 text-warning",
    expired: "bg-danger/10 text-danger",
  };
  return (
    <span
      className={`inline-flex rounded-full px-3 py-0.5 text-xs font-semibold capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
};

const renderColumns: Column<Member>[] = [
  { key: "name", header: "Name" },
  { key: "plan", header: "Plan", emptyValue: "No plan" },
  {
    key: "sessions",
    header: "Sessions",
    align: "right",
    render: (value) => `${Number(value)} sessions`,
  },
  {
    key: "status",
    header: "Status",
    align: "center",
    render: (value) => statusPill(value as Member["status"]),
  },
];

// TEMPORARY preview page — remove before merging to main.
export const TablePreview = () => {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 bg-surface px-4 py-10 text-text-primary">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">
          Temporary preview
        </p>
        <h1 className="text-3xl font-bold tracking-tight">Table implementations</h1>
        <p className="text-sm text-text-secondary">
          Visual check of the current presentational Table variants. Route:{" "}
          <code className="rounded bg-surface-over px-1.5 py-0.5">/table-preview</code>
        </p>
      </header>

      <section aria-labelledby="preview-basic" className="flex flex-col gap-3">
        <h2 id="preview-basic" className="text-lg font-semibold">
          Basic
        </h2>
        <Table data={members} columns={basicColumns} caption="Members basic table" />
      </section>

      <section aria-labelledby="preview-render" className="flex flex-col gap-3">
        <h2 id="preview-render" className="text-lg font-semibold">
          Custom render + empty value
        </h2>
        <Table
          data={members}
          columns={renderColumns}
          caption="Members with status pills"
          striped
        />
      </section>

      <section aria-labelledby="preview-dense" className="flex flex-col gap-3">
        <h2 id="preview-dense" className="text-lg font-semibold">
          Dense + sticky header
        </h2>
        <div className="max-h-56">
          <Table
            data={members}
            columns={basicColumns}
            caption="Members dense sticky table"
            size="sm"
            stickyHeader
          />
        </div>
      </section>

      <section aria-labelledby="preview-cards" className="flex flex-col gap-3">
        <h2 id="preview-cards" className="text-lg font-semibold">
          Cards on mobile
        </h2>
        <p className="text-sm text-text-secondary text-wrap wrap-break-word">
          Resize below 942px (tab breakpoint): rows become cards with the name
          as title. The scroll table underneath opts out via{" "}
          <code className="rounded bg-surface-over px-1.5 py-0.5">
            responsive="scroll"
          </code>
          .
        </p>
        <Table
          data={members}
          columns={renderColumns}
          caption="Members cards preview"
          cardTitleKey="name"
        />
        <Table
          data={members}
          columns={basicColumns}
          caption="Members scroll preview"
          responsive="scroll"
        />
      </section>

      <section aria-labelledby="preview-empty" className="flex flex-col gap-3">
        <h2 id="preview-empty" className="text-lg font-semibold">
          Empty states
        </h2>
        <Table data={[]} columns={basicColumns} caption="Members empty table" />
        <Table
          data={[]}
          columns={basicColumns}
          caption="Members custom empty message"
          emptyMessage="No members found. Try adjusting your filters."
        />
      </section>
    </main>
  );
};
