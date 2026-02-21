import { DecisionStatus } from "./types";

export const STATUS_CONFIG: Record<
  DecisionStatus,
  { label: string; color: string; bgColor: string; description: string }
> = {
  open: {
    label: "Open",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    description: "Not yet answered",
  },
  draft: {
    label: "Draft",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    description: "Answer saved, not yet confirmed",
  },
  confirmed: {
    label: "Confirmed",
    color: "text-green-700",
    bgColor: "bg-green-50",
    description: "Answer finalized by stakeholder",
  },
  implemented: {
    label: "Implemented",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    description: "Built into the system",
  },
};

export const APP_NAME = "InsureWright Onboarding";
export const APP_DESCRIPTION =
  "Stakeholder onboarding portal for underwriting decisions — Ireland, UK & EEA specialty MGA market";
