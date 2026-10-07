// TODO(TEMP): remove this preview page and its route before the final PR.
// It exists only to demo SortDropdown + SortDirectionToggle + SortControls.
import { useMemo } from "react";
import { CommandBtn } from "@/components/buttons/Buttons";
import { SortControls } from "@/components/sort/SortControls";
import { SortDirectionToggle } from "@/components/sort/SortDirectionToggle";
import { SortDropdown } from "@/components/sort/SortDropdown";
import { useSortControls } from "@/hooks/useSortControls";
import type { SortOption } from "@/types/Types";

type MemberField = "name" | "startDate" | "plan";

type PreviewMember = {
  id: number;
  name: string;
  startDate: string;
  plan: string;
};

const SORT_OPTIONS: ReadonlyArray<SortOption<MemberField>> = [
  { value: "name", label: "Name", description: "Sort by member name" },
  { value: "startDate", label: "Start date", description: "Sort by start date" },
  { value: "plan", label: "Plan", description: "Sort by plan name" },
];

const MEMBERS: ReadonlyArray<PreviewMember> = [
  { id: 1, name: "Valeria Cruz", startDate: "2025-03-14", plan: "Pro" },
  { id: 2, name: "Andres Mora", startDate: "2024-11-02", plan: "Basic" },
  { id: 3, name: "Lucia Ramos", startDate: "2026-01-20", plan: "Elite" },
  { id: 4, name: "Bruno Diaz", startDate: "2025-07-09", plan: "Pro" },
];

function compareMembers(
  a: PreviewMember,
  b: PreviewMember,
  sortBy: MemberField,
  direction: "asc" | "desc",
): number {
  const order = direction === "asc" ? 1 : -1;
  return String(a[sortBy]).localeCompare(String(b[sortBy])) * order;
}

export function SortPreviewPage() {
  const {
    sortBy,
    direction,
    reset,
    sortDropdownProps,
    directionToggleProps,
    queryParams,
  } = useSortControls<MemberField>({ options: SORT_OPTIONS });

  const sorted = useMemo(
    () => [...MEMBERS].sort((a, b) => compareMembers(a, b, sortBy, direction)),
    [sortBy, direction],
  );

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 bg-surface px-4 py-10 text-text-primary">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">
          Temporary preview — remove before final PR
        </p>
        <h1 className="text-2xl font-bold tracking-tight">
          Sort controls preview
        </h1>
        <p className="text-sm text-text-secondary">
          Sort field dropdown plus ASC/DESC toggle sharing the SortControls
          layout, wired through useSortControls.
        </p>
      </header>

      <SortControls label="Sort members">
        <SortDropdown {...sortDropdownProps} />
        <SortDirectionToggle {...directionToggleProps} />
        <CommandBtn onClick={reset} className="px-3 py-1.5 text-xs">
          Reset
        </CommandBtn>
      </SortControls>

      <p aria-live="polite" className="text-sm text-text-secondary">
        Sorting by <strong className="text-text-primary">{sortBy}</strong> in{" "}
        <strong className="text-text-primary">
          {direction === "asc" ? "ascending" : "descending"}
        </strong>{" "}
        order · query:{" "}
        <code className="rounded bg-surface-raised px-1.5 py-0.5 text-xs">
          {`?sortBy=${queryParams.sortBy}&direction=${queryParams.direction}`}
        </code>
      </p>

      <section aria-labelledby="preview-results-title">
        <h2 id="preview-results-title" className="sr-only">
          Sorted members
        </h2>
        <ul className="flex flex-col gap-2">
          {sorted.map((member) => (
            <li
              key={member.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-surface-raised px-4 py-3"
            >
              <span className="font-medium">{member.name}</span>
              <span className="text-sm text-text-secondary">
                {member.startDate} · {member.plan}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
