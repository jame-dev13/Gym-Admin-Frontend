import { Eye } from "lucide-react";
import { CommandBtn } from "@/components/buttons/Buttons";
import { useModalContext } from "@/context/useModalContext";
import { AuditLogDetails } from "@/features/audit/components/AuditLogDetails";
import type { AuditLogResponse } from "@/features/audit/types";

export const AuditLogDetailsButton = ({
  data,
}: {
  data: AuditLogResponse;
}) => {
  const { isOpen, openModal } = useModalContext();

  const openDetails = () => {
    openModal({
      title: "Audit log details",
      description: `${data.action || "Audit event"} · ${data.entity?.type ?? "entity"}`,
      size: "lg",
      data,
      render: (selected) => <AuditLogDetails data={selected} />,
    });
  };

  return (
    <CommandBtn
      Icon={Eye}
      onClick={openDetails}
      disabled={isOpen}
      aria-label={`Show details for ${data.action || "audit log"}`}
      className="w-full tab:w-auto"
    >
      Show details
    </CommandBtn>
  );
};
