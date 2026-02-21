// ============================================================
// STATUS & INPUT TYPES
// ============================================================

export type DecisionStatus = "open" | "draft" | "confirmed" | "implemented";

export type InputType =
  | "free_text"
  | "rich_text"
  | "single_select"
  | "multi_select"
  | "numeric"
  | "yes_no"
  | "file_upload"
  | "data_table";

export type CategorySlug =
  | "appetite-business-rules"
  | "lines-of-business"
  | "data-fields-requirements"
  | "document-standards"
  | "rating-methodology"
  | "workflow-sops"
  | "adverse-news-criteria"
  | "compliance-audit"
  | "quote-packaging"
  | "measures-success-criteria";

// ============================================================
// CATEGORY
// ============================================================

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  icon: string; // lucide-react icon name
  order: number;
}

// ============================================================
// DECISION DEFINITION (static — dev team defines, Neil never sees code)
// ============================================================

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface TableColumn {
  key: string;
  label: string;
  type: "text" | "number" | "select";
  options?: SelectOption[];
  required?: boolean;
}

export interface NumericValidation {
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  prefix?: string;
  suffix?: string;
}

export interface DecisionDefinition {
  id: string;
  categorySlug: CategorySlug;
  title: string;
  question: string;
  context: string;
  inputType: InputType;
  options?: SelectOption[];
  tableColumns?: TableColumn[];
  numericValidation?: NumericValidation;
  placeholder?: string;
  required: boolean;
  order: number;
  dependsOn?: string[];
}

// ============================================================
// DYNAMIC STATE (changes as Neil answers)
// ============================================================

export interface UploadedFile {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  url: string;
  description?: string;
}

export interface Comment {
  id: string;
  author: "neil" | "team";
  authorName: string;
  content: string;
  createdAt: string;
}

export interface TableRow {
  [key: string]: string | number | boolean;
}

export type AnswerValue =
  | string
  | string[]
  | number
  | boolean
  | TableRow[]
  | null;

export interface DecisionState {
  decisionId: string;
  status: DecisionStatus;
  answer: AnswerValue;
  notes: string;
  attachments: UploadedFile[];
  comments: Comment[];
  flaggedForDiscussion: boolean;
  lastUpdatedAt: string | null;
  confirmedAt: string | null;
  implementedAt: string | null;
}

// ============================================================
// ACTIVITY LOG
// ============================================================

export type ActivityAction =
  | "answer_saved"
  | "answer_confirmed"
  | "answer_updated"
  | "status_changed"
  | "comment_added"
  | "file_uploaded"
  | "file_removed"
  | "flagged"
  | "unflagged"
  | "marked_implemented";

export interface ActivityEntry {
  id: string;
  decisionId: string;
  action: ActivityAction;
  actor: "neil" | "team";
  actorName: string;
  summary: string;
  timestamp: string;
  previousValue?: string;
  newValue?: string;
}

// ============================================================
// TOP-LEVEL APP STATE
// ============================================================

export interface AppState {
  version: number;
  lastSavedAt: string;
  decisions: Record<string, DecisionState>;
  activityLog: ActivityEntry[];
}
