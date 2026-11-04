import { DropdownQuickCommands } from "@/features/administration/components/DropdownQuickCommands";
import { DropdownQuickLinks } from "@/features/administration/components/DropdownQuickLinks";

export const AdministrationQuickActions = () => {
  return (
    <section
      className="flex w-full flex-col gap-3 tab:flex-row tab:items-center tab:justify-between"
      aria-labelledby="administration-actions-heading"
    >
      <div className="flex min-w-0 flex-col gap-1">
        <h2
          id="administration-actions-heading"
          className="text-lg font-semibold tracking-tight text-text-primary"
        >
          Quick actions
        </h2>
        <p className="text-sm text-text-secondary">
          Common administration tasks.
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 tab:w-auto tab:shrink-0 [&>div]:w-full">
        <DropdownQuickCommands />
        <DropdownQuickLinks />
      </div>
    </section>
  );
};
