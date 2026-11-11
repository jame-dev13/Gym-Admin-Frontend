import { Badge } from "@/components/badge/Badge";
import type { BadgeVariant } from "@/components/badge/BadgeTypes";
import { Navbar } from "@/components/navbar/Navbar";
import {
  AlertTriangle,
  Archive,
  ArrowRight,
  BookOpen,
  CalendarPlus,
  CheckCircle2,
  DatabaseBackup,
  Download,
  Flame,
  History,
  Info,
  KeyRound,
  ListChecks,
  LockKeyhole,
  Mail,
  Pencil,
  PlusCircle,
  Recycle,
  RefreshCw,
  RotateCcw,
  ScrollText,
  Search,
  ShieldCheck,
  Trash2,
  TriangleAlert,
  UserRound,
  Users,
  Workflow,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

const GUIDE_LINKS = [
  { href: "#guide-workflow", label: "Workflow", Icon: Workflow },
  { href: "#guide-users", label: "Users", Icon: UserRound },
  { href: "#guide-customers", label: "Customers", Icon: Users },
  { href: "#guide-subscriptions", label: "Subscriptions", Icon: CalendarPlus },
  { href: "#guide-operations", label: "Monitoring", Icon: ScrollText },
  { href: "#guide-backups", label: "Backups", Icon: DatabaseBackup },
  { href: "#guide-reference", label: "Reference", Icon: ListChecks },
];

type GuideSectionProps = {
  id: string;
  headingId: string;
  title: string;
  description: string;
  Icon: LucideIcon;
  children: ReactNode;
};

const GuideSection = ({
  id,
  headingId,
  title,
  description,
  Icon,
  children,
}: GuideSectionProps) => (
  <section
    id={id}
    aria-labelledby={headingId}
    className="flex scroll-mt-24 flex-col gap-4"
  >
    <div className="flex items-start gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
        <Icon size={18} aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-1">
        <h2
          id={headingId}
          className="text-lg font-semibold tracking-tight text-text-primary"
        >
          {title}
        </h2>
        <p className="text-sm leading-relaxed text-text-secondary">
          {description}
        </p>
      </div>
    </div>

    <div className="flex flex-col gap-4">{children}</div>
  </section>
);

type GuideCardProps = {
  title: string;
  description?: string;
  Icon?: LucideIcon;
  children: ReactNode;
};

const GuideCard = ({ title, description, Icon, children }: GuideCardProps) => (
  <article className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-raised/80 p-5">
    <div className="flex items-start gap-3">
      {Icon ? (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <Icon size={16} aria-hidden="true" />
        </span>
      ) : null}
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold tracking-tight text-text-primary">
          {title}
        </h3>
        {description ? (
          <p className="text-sm leading-relaxed text-text-secondary">
            {description}
          </p>
        ) : null}
      </div>
    </div>

    {children}
  </article>
);

type GuideStep = Readonly<{
  title: string;
  detail: string;
}>;

const GuideSteps = ({ steps }: { steps: readonly GuideStep[] }) => (
  <ol className="flex flex-col gap-3">
    {steps.map((step, index) => (
      <li key={step.title} className="flex gap-3">
        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-xs font-bold text-accent">
          {index + 1}
        </span>
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-semibold text-text-primary">{step.title}</p>
          <p className="text-sm leading-relaxed text-text-secondary">
            {step.detail}
          </p>
        </div>
      </li>
    ))}
  </ol>
);

const GuideList = ({
  items,
  Icon = CheckCircle2,
}: {
  items: readonly string[];
  Icon?: LucideIcon;
}) => (
  <ul className="flex flex-col gap-2.5">
    {items.map((item) => (
      <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-text-secondary">
        <Icon
          size={15}
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-accent"
        />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

type CalloutTone = "info" | "warning" | "danger" | "success";

const CALLOUT_CONFIG: Record<
  CalloutTone,
  { Icon: LucideIcon; root: string; icon: string }
> = {
  info: {
    Icon: Info,
    root: "border-accent/30 bg-accent/10",
    icon: "text-accent",
  },
  warning: {
    Icon: TriangleAlert,
    root: "border-warning/30 bg-warning/10",
    icon: "text-warning",
  },
  danger: {
    Icon: AlertTriangle,
    root: "border-danger/30 bg-danger/10",
    icon: "text-danger",
  },
  success: {
    Icon: CheckCircle2,
    root: "border-success/30 bg-success/10",
    icon: "text-success",
  },
};

const GuideCallout = ({
  tone = "info",
  title,
  children,
}: {
  tone?: CalloutTone;
  title: string;
  children: ReactNode;
}) => {
  const { Icon, root, icon } = CALLOUT_CONFIG[tone];

  return (
    <aside
      role={tone === "danger" ? "alert" : undefined}
      className={`flex gap-3 rounded-2xl border p-4 ${root}`}
    >
      <Icon
        size={18}
        aria-hidden="true"
        className={`mt-0.5 shrink-0 ${icon}`}
      />
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-text-primary">{title}</p>
        <div className="text-sm leading-relaxed text-text-secondary">
          {children}
        </div>
      </div>
    </aside>
  );
};

type StatusRow = Readonly<{
  status: string;
  label: string;
  variant: BadgeVariant;
  meaning: string;
}>;

const SUBSCRIPTION_STATUSES: readonly StatusRow[] = [
  {
    status: "NOT_PAID",
    label: "Not paid",
    variant: "rose",
    meaning: "The subscription exists but its payment has not been registered yet.",
  },
  {
    status: "PAID",
    label: "Paid",
    variant: "emerald",
    meaning: "Payment for the active period is confirmed.",
  },
  {
    status: "ON_RENEWAL",
    label: "On renewal",
    variant: "purple",
    meaning: "A renewal is in progress and the previous period is closing.",
  },
  {
    status: "RENEWED",
    label: "Renewed",
    variant: "blue",
    meaning: "The renewal completed and a new period is active.",
  },
  {
    status: "DROPPED",
    label: "Dropped",
    variant: "amber",
    meaning: "The customer stopped or the plan was cancelled; review before editing.",
  },
  {
    status: "FINALIZED",
    label: "Finalized",
    variant: "slate",
    meaning: "The membership was closed as final and no further periods are expected.",
  },
];

const StatusTable = () => (
  <div className="overflow-x-auto rounded-2xl border border-border">
    <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
      <thead className="bg-surface-over/40 text-text-tertiary">
        <tr>
          <th scope="col" className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wider">
            Status
          </th>
          <th scope="col" className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wider">
            What it means
          </th>
        </tr>
      </thead>
      <tbody>
        {SUBSCRIPTION_STATUSES.map(({ status, label, variant, meaning }) => (
          <tr key={status} className="border-t border-border/60">
            <th scope="row" className="whitespace-nowrap px-3 py-3 font-medium">
              <Badge variant={variant} leading="dot">
                {label}
              </Badge>
            </th>
            <td className="px-3 py-3 leading-relaxed text-text-secondary">
              {meaning}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

type LifecycleRow = Readonly<{
  record: string;
  softDelete: string;
  recycle: string;
  permanent: string;
}>;

const LIFECYCLE_ROWS: readonly LifecycleRow[] = [
  {
    record: "User",
    softDelete: "Remove user",
    recycle: "Recycle Bin › Users",
    permanent: "Erase from Recycle Bin",
  },
  {
    record: "Customer",
    softDelete: "Remove customer",
    recycle: "Create Customer again from Users",
    permanent: "Not exposed in the UI",
  },
  {
    record: "Subscription",
    softDelete: "Not available",
    recycle: "Not available",
    permanent: "Delete subscription",
  },
  {
    record: "Backup",
    softDelete: "Delete backup",
    recycle: "Recycle Bin › Backups",
    permanent: "Erase from Recycle Bin",
  },
];

const LifecycleTable = () => (
  <div className="overflow-x-auto rounded-2xl border border-border">
    <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
      <thead className="bg-surface-over/40 text-text-tertiary">
        <tr>
          <th scope="col" className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wider">
            Record
          </th>
          <th scope="col" className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wider">
            Soft delete
          </th>
          <th scope="col" className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wider">
            Recovery path
          </th>
          <th scope="col" className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wider">
            Permanent action
          </th>
        </tr>
      </thead>
      <tbody>
        {LIFECYCLE_ROWS.map((row) => (
          <tr key={row.record} className="border-t border-border/60">
            <th scope="row" className="whitespace-nowrap px-3 py-3 font-semibold text-text-primary">
              {row.record}
            </th>
            <td className="px-3 py-3 text-text-secondary">{row.softDelete}</td>
            <td className="px-3 py-3 text-text-secondary">{row.recycle}</td>
            <td className="px-3 py-3 text-text-secondary">{row.permanent}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const GuideLayout = () => (
  <section
    className="flex h-full min-h-0 w-full flex-col gap-6 overflow-y-auto overscroll-contain pr-2 [scrollbar-color:var(--color-border)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border"
    aria-labelledby="administration-guide-heading"
  >
    <Navbar
      links={GUIDE_LINKS}
      brand="Administration guide"
      aria-label="Guide sections"
      className="backdrop-blur-sm bg-surface/90"
    />

    <div className="flex min-h-0 flex-1 flex-col gap-6 pb-2">
      <header className="flex flex-col gap-2">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
          <BookOpen size={14} aria-hidden="true" />
          Administration manual
        </span>
        <h1
          id="administration-guide-heading"
          className="text-3xl font-bold tracking-tight text-text-primary"
        >
          Administration guide
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-text-secondary">
          A practical walkthrough of the Gym Admin services: create staff and
          member accounts, convert members into customers, assign subscriptions,
          understand deletion and recovery paths, and protect data with backups.
        </p>
      </header>

      <div className="flex flex-col gap-8">
        <GuideSection
          id="guide-workflow"
          headingId="guide-workflow-heading"
          title="Recommended workflow"
          description="Follow this order on your first run. The application links each record to the previous one, so skipping a step usually blocks the next."
          Icon={Workflow}
        >
          <GuideCard
            title="The path from a new member to an active subscription"
            Icon={ArrowRight}
          >
            <GuideSteps
              steps={[
                {
                  title: "Create the user account",
                  detail:
                    "Open Services › Users and choose Add user. Use USER for gym members and ADMIN only for staff who need full administration access.",
                },
                {
                  title: "Convert the member into a customer",
                  detail:
                    "On the Users table, use Create Customer for a USER account. This creates the customer profile that memberships are attached to.",
                },
                {
                  title: "Assign a subscription",
                  detail:
                    "Open Services › Subscriptions and choose Add subscription. Use the customer's exact email and select a membership plan.",
                },
                {
                  title: "Verify the result",
                  detail:
                    "Check the row status, the Overview counters, and Audit Logs for the latest operation before moving to the next member.",
                },
                {
                  title: "Protect irreversible work",
                  detail:
                    "Create a backup in Dumps before bulk edits, restores, or permanent deletions.",
                },
              ]}
            />
          </GuideCard>

          <GuideCallout tone="warning" title="Respect the dependency order">
            A subscription belongs to a customer, and a customer originates from
            a user. Deactivating the user or customer first can block
            customer-based operations, so resolve membership changes before
            removing parent records.
          </GuideCallout>

          <GuideCard
            title="Controls shared by every service table"
            Icon={ListChecks}
          >
            <GuideList
              Icon={Search}
              items={[
                "The create action sits in the table toolbar, next to the title (for example, Add user or Add subscription).",
                "Search, column sorting, direction, refresh, and pagination apply to the current table only.",
                "Row actions are the icon buttons at the end of each row; hover or focus them to read the action name.",
                "Destructive actions are highlighted in red and always open a confirmation dialog before running.",
              ]}
            />
          </GuideCard>
        </GuideSection>

        <GuideSection
          id="guide-users"
          headingId="guide-users-heading"
          title="Users"
          description="User accounts represent everyone who can sign in: administrators and gym members. Only member accounts can become customers."
          Icon={UserRound}
        >
          <div className="grid gap-4 xl:grid-cols-2">
            <GuideCard
              title="Create or edit a user"
              description="The password is only set when the account is created."
              Icon={PlusCircle}
            >
              <GuideSteps
                steps={[
                  {
                    title: "Open Services › Users",
                    detail:
                      "The toolbar lists all accounts with name, email, authentication provider, roles, and customer status.",
                  },
                  {
                    title: "Choose Add user",
                    detail:
                      "Complete Name, Email, Password, and Roles. Roles accepts User or Admin.",
                  },
                  {
                    title: "Edit from the row actions",
                    detail:
                      "Edit allows changing name, email, and roles. Password is intentionally omitted from the edit form.",
                  },
                ]}
              />
              <GuideCallout tone="info" title="Email is a key identifier">
                Use the member's real email and keep it unique. It is the value
                used later to locate the customer profile and assign
                subscriptions.
              </GuideCallout>
            </GuideCard>

            <GuideCard
              title="Turn a user into a customer"
              description="The Customers table is fed from member accounts."
              Icon={Users}
            >
              <GuideSteps
                steps={[
                  {
                    title: "Find an account with role USER",
                    detail:
                      "The Customer column only offers Create Customer for USER accounts that are not linked yet. ADMIN accounts are not converted.",
                  },
                  {
                    title: "Choose Create Customer",
                    detail:
                      "Complete the customer phone number and save. The profile then appears in Services › Customers.",
                  },
                  {
                    title: "If the email already has a profile",
                    detail:
                      "The form switches to recovery instead of creating a duplicate. Confirm the re-activation to bring the existing customer back.",
                  },
                ]}
              />
            </GuideCard>
          </div>

          <GuideCard
            title="Remove, recover, or erase a user"
            description="Removal is reversible until the record is erased permanently."
            Icon={Trash2}
          >
            <GuideSteps
              steps={[
                {
                  title: "Remove user (soft delete)",
                  detail:
                    "Use the Remove user row action. The account loses access immediately but remains available in Recycle Bin › Users.",
                },
                {
                  title: "Recover user",
                  detail:
                    "Open Recycle Bin › Users and choose Recover. Access returns according to the account's own role.",
                },
                {
                  title: "Erase user (permanent)",
                  detail:
                    "Choose Erase in Recycle Bin › Users. The record is permanently removed and cannot be recovered.",
                },
              ]}
            />
            <GuideCallout tone="danger" title="Do not erase to fix a login problem">
              Edit the account or recover it first. Erasing is final and also
              removes the user record that may still be linked to a customer.
            </GuideCallout>
          </GuideCard>

          <GuideCallout tone="info" title="Role guidance">
            Grant USER by default. Use ADMIN only for people who need to manage
            users, customers, subscriptions, backups, and audit logs. Avoid
            sharing administrator accounts.
          </GuideCallout>
        </GuideSection>

        <GuideSection
          id="guide-customers"
          headingId="guide-customers-heading"
          title="Customers"
          description="Customer profiles connect a user account to gym activity. Name and email come from the linked user; contact and address live on the customer."
          Icon={Users}
        >
          <div className="grid gap-4 xl:grid-cols-2">
            <GuideCard
              title="Create a customer profile"
              description="Always start from the user account so the link is preserved."
              Icon={PlusCircle}
            >
              <GuideSteps
                steps={[
                  {
                    title: "Open Services › Users",
                    detail:
                      "Locate the member account. The Create Customer link appears when the user has the USER role and no customer profile.",
                  },
                  {
                    title: "Complete the contact details",
                    detail:
                      "Phone number is the core field. Address details (city, locality, street, colony, home number, and CP) can be added when available.",
                  },
                  {
                    title: "Confirm in Services › Customers",
                    detail:
                      "The new profile shows the linked name, email, phone, and an address details link.",
                  },
                ]}
              />
            </GuideCard>

            <GuideCard
              title="Edit customer details"
              description="Keep the profile aligned with the source account."
              Icon={Pencil}
            >
              <GuideList
                Icon={Pencil}
                items={[
                  "Use the Edit row action in Customers to update the phone number and address information.",
                  "Customer name and email are derived from the linked user. Change them in Users, not in the customer form.",
                  "Address fields are optional, but a complete profile makes member contact and billing follow-up easier.",
                ]}
              />
            </GuideCard>
          </div>

          <GuideCard
            title="Remove or recover a customer"
            description="The customer record can be deactivated without deleting the user account."
            Icon={RotateCcw}
          >
            <GuideSteps
              steps={[
                {
                  title: "Remove customer",
                  detail:
                    "Use the Remove row action in Customers. The customer loses access to customer-based operations, but the user account remains.",
                },
                {
                  title: "Recover the customer",
                  detail:
                    "Return to Users, find the same account, and choose Create Customer again. When the profile already exists, the application offers the Recover action instead of a duplicate form.",
                },
                {
                  title: "Recover the parent first",
                  detail:
                    "If the user was also removed, recover the user in Recycle Bin › Users before attempting to recover the customer.",
                },
              ]}
            />
            <GuideCallout tone="warning" title="Users and customers have separate lifecycles">
              Removing one does not remove the other. Restore the parent user
              before trying to bring a customer profile back.
            </GuideCallout>
          </GuideCard>
        </GuideSection>

        <GuideSection
          id="guide-subscriptions"
          headingId="guide-subscriptions-heading"
          title="Subscriptions"
          description="Subscriptions attach a membership plan to an existing customer and drive the billing, ranking, and evolution views."
          Icon={CalendarPlus}
        >
          <div className="grid gap-4 xl:grid-cols-2">
            <GuideCard
              title="Add a subscription"
              description="The customer must exist before the subscription is created."
              Icon={CalendarPlus}
            >
              <GuideSteps
                steps={[
                  {
                    title: "Confirm the customer is active",
                    detail:
                      "Search Services › Customers and verify the email and current profile before assigning a plan.",
                  },
                  {
                    title: "Open Services › Subscriptions",
                    detail:
                      "Choose Add subscription from the table toolbar.",
                  },
                  {
                    title: "Enter the customer email and plan",
                    detail:
                      "Select Biweekly, Monthly, Quarterly, or Annual. The price is assigned by the plan configured in the system.",
                  },
                  {
                    title: "Review the new row",
                    detail:
                      "Open the period details link to inspect the generated periods and confirm the status before sharing it with the customer.",
                  },
                ]}
              />
              <GuideCallout tone="warning" title="Email is the subscription key">
                Copy the email from Customers instead of typing it by hand. A
                typo can attach the subscription to the wrong customer or make
                the operation fail.
              </GuideCallout>
            </GuideCard>

            <GuideCard
              title="Edit, finalize, or delete"
              description="Finalizing and deleting require an explicit authorization confirmation."
              Icon={ShieldCheck}
            >
              <GuideList
                Icon={Pencil}
                items={[
                  "Edit changes the customer email or membership plan. Use it to correct a plan before the period is finalized.",
                  "Finalize marks the subscription as FINALIZED. First tick the checkbox confirming the customer authorized the change.",
                  "Delete removes the subscription and its periods. It is not stored in the Recycle Bin, so treat it as permanent.",
                  "Deleting also requires the customer authorization checkbox. There is no undo for a deleted subscription.",
                ]}
              />
            </GuideCard>
          </div>

          <GuideCard
            title="Subscription status reference"
            description="Statuses describe the billing and renewal state of the membership."
            Icon={RefreshCw}
          >
            <StatusTable />
          </GuideCard>
        </GuideSection>

        <GuideSection
          id="guide-operations"
          headingId="guide-operations-heading"
          title="Monitoring and audit"
          description="Use the Overview and Audit Logs to confirm that an operation produced the expected result."
          Icon={ScrollText}
        >
          <div className="grid gap-4 xl:grid-cols-2">
            <GuideCard
              title="Read the gym overview"
              description="Overview is the daily health check for the administration area."
              Icon={CheckCircle2}
            >
              <GuideList
                items={[
                  "Summary counters show active members, monthly revenue, expiring subscriptions, and new sign-ups.",
                  "Subscriptions ending soon lists memberships that need a renewal follow-up.",
                  "Overview › Subscriptions, Rankings, Evolution, and Billing are read-only analytics; changing records updates them automatically.",
                  "Use the year selector in Evolution and Billing to compare historical periods instead of assuming the current year.",
                ]}
              />
            </GuideCard>

            <GuideCard
              title="Trace an operation in Audit Logs"
              description="Every administrative mutation refreshes the audit trail."
              Icon={ScrollText}
            >
              <GuideSteps
                steps={[
                  {
                    title: "Open Services › Audit Logs",
                    detail:
                      "Each row shows the entity, actor, action, success or error status, and creation time.",
                  },
                  {
                    title: "Search or sort for the record",
                    detail:
                      "Filter by action or entity and sort by date to isolate the operation you want to inspect.",
                  },
                  {
                    title: "Open the details",
                    detail:
                      "The details action shows the summary, request metadata, and before/after values for CRUD operations.",
                  },
                ]}
              />
              <GuideCallout tone="info" title="Logs are evidence, not backups">
                Audit Logs record what happened. They cannot restore deleted
                data; use Dumps or the Recycle Bin for recovery.
              </GuideCallout>
            </GuideCard>
          </div>
        </GuideSection>

        <GuideSection
          id="guide-backups"
          headingId="guide-backups-heading"
          title="Dumps, backups, and the Recycle Bin"
          description="Backups protect the whole data set, while the Recycle Bin restores records removed with a soft delete."
          Icon={DatabaseBackup}
        >
          <div className="grid gap-4 xl:grid-cols-2">
            <GuideCard
              title="Create and download a backup"
              description="Take a snapshot before any bulk or irreversible change."
              Icon={DatabaseBackup}
            >
              <GuideSteps
                steps={[
                  {
                    title: "Open Services › Dumps",
                    detail:
                      "Choose Make Backup and confirm the dialog to start a new snapshot.",
                  },
                  {
                    title: "Wait for the SUCCESS status",
                    detail:
                      "In progress means the backup is still being generated. Failure means the snapshot cannot be used.",
                  },
                  {
                    title: "Download a copy",
                    detail:
                      "Use the Download row action to keep an off-platform copy for disaster recovery.",
                  },
                ]}
              />
            </GuideCard>

            <GuideCard
              title="Restore from a backup"
              description="Restoring rolls the live application data back to the snapshot."
              Icon={History}
            >
              <GuideSteps
                steps={[
                  {
                    title: "Pick a usable snapshot",
                    detail:
                      "Restore is disabled for FAILURE snapshots and for backups that are still in PROGRESS. Wait for a completed backup before relying on it.",
                  },
                  {
                    title: "Understand the impact",
                    detail:
                      "The confirmation warns that changes made after the backup was created will be lost.",
                  },
                  {
                    title: "Confirm and verify",
                    detail:
                      "After restoring, check the affected records and the Audit Logs before resuming normal work.",
                  },
                ]}
              />
              <GuideCallout tone="warning" title="Restore is not the same as recover">
                Restore replaces live data with a past snapshot. Recover only
                returns a deleted backup record to the Dumps list.
              </GuideCallout>
            </GuideCard>
          </div>

          <GuideCard
            title="Delete, recover, or erase a backup"
            description="Deleted backups move to Recycle Bin › Backups before permanent removal."
            Icon={Archive}
          >
            <GuideSteps
              steps={[
                {
                  title: "Delete backup",
                  detail:
                    "Use the Delete row action in Dumps. The snapshot leaves the active list and appears in Recycle Bin › Backups.",
                },
                {
                  title: "Recover backup",
                  detail:
                    "Use Recover in the Recycle Bin. It is available only for snapshots with SUCCESS or RESTORED status.",
                },
                {
                  title: "Erase backup",
                  detail:
                    "Use Erase only when the retention policy allows it. The backup file is permanently destroyed and cannot be restored.",
                },
              ]}
            />
            <div className="flex flex-wrap gap-2 text-xs text-text-tertiary">
              <span className="inline-flex items-center gap-1.5">
                <Download size={14} aria-hidden="true" />
                Download keeps an external copy.
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Flame size={14} aria-hidden="true" />
                Erase is permanent.
              </span>
            </div>
          </GuideCard>
        </GuideSection>

        <GuideSection
          id="guide-reference"
          headingId="guide-reference-heading"
          title="Quick reference"
          description="Constraints and safeguards to check before making a destructive change."
          Icon={ListChecks}
        >
          <div className="grid gap-4 xl:grid-cols-2">
            <GuideCard
              title="Key constraints"
              description="These rules come from how the records are linked."
              Icon={LockKeyhole}
            >
              <GuideList
                items={[
                  "Create records in order: user, then customer, then subscription.",
                  "Emails must be valid and consistent; the subscription is matched by the customer email.",
                  "Only USER accounts can be converted into customers; ADMIN accounts do not show the customer action.",
                  "Customer name and email mirror the linked user, so edit them at the user level.",
                  "A user password is set only at creation and is not editable from the user edit form.",
                  "Finalize and delete subscription both require confirming customer authorization.",
                  "Only completed backups can be restored, and only SUCCESS or RESTORED backups can be recovered from the Recycle Bin.",
                  "Users and backups have a Recycle Bin. Subscriptions do not, and customers recover through the same user account.",
                ]}
              />
            </GuideCard>

            <GuideCard
              title="Before a destructive action"
              description="Run through this list to avoid removing the wrong record."
              Icon={AlertTriangle}
            >
              <GuideList
                Icon={CheckCircle2}
                items={[
                  "Identify the exact record by ID or email and confirm it with the responsible person.",
                  "Check dependencies: user, customer, subscription, and any related periods.",
                  "Create a backup when the change is broad or cannot be reversed from the Recycle Bin.",
                  "Prefer soft delete and recovery over permanent erase.",
                  "Verify the outcome in the affected table and in Audit Logs.",
                ]}
              />
            </GuideCard>
          </div>

          <GuideCard
            title="Deletion and recovery map"
            description="Where each record goes and how it can be brought back."
            Icon={Recycle}
          >
            <LifecycleTable />
          </GuideCard>

          <GuideCallout tone="success" title="When in doubt, deactivate first">
            Soft delete keeps the record available for recovery. Verify the
            effect on the member's access, then erase permanently only after the
            retention window and with the required authorization.
          </GuideCallout>

          <div className="flex flex-wrap items-center gap-2 text-xs text-text-tertiary">
            <KeyRound size={14} aria-hidden="true" />
            <span>
              Keep administrator credentials private. Every action you take is
              recorded in Audit Logs under your account.
            </span>
            <XCircle size={14} aria-hidden="true" />
            <span>No destructive action offers an undo except the Recycle Bin.</span>
            <Mail size={14} aria-hidden="true" />
            <span>Use the same email across user, customer, and subscription.</span>
          </div>
        </GuideSection>
      </div>
    </div>
  </section>
);

export default GuideLayout;
