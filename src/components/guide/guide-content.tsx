"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Layers,
  Lock,
  LayoutDashboard,
  List,
  FileText,
  Type,
  Save,
  RotateCcw,
  Flag,
  CircleDot,
  FolderOpen,
  Activity,
  Download,
  Hash,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  Upload,
  MessageSquare,
  ToggleRight,
  Table2,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface TocEntry {
  id: string;
  label: string;
  depth: number;
}

/* ------------------------------------------------------------------ */
/*  Table of Contents                                                  */
/* ------------------------------------------------------------------ */
const TOC: TocEntry[] = [
  { id: "overview", label: "Platform Overview", depth: 0 },
  { id: "authentication", label: "Authentication", depth: 0 },
  { id: "pin-login", label: "PIN Login", depth: 1 },
  { id: "session-signout", label: "Session & Sign Out", depth: 1 },
  { id: "dashboard", label: "Dashboard", depth: 0 },
  { id: "progress-overview", label: "Progress Overview", depth: 1 },
  { id: "category-cards", label: "Category Cards", depth: 1 },
  { id: "flagged-activity", label: "Flagged Items & Recent Activity", depth: 1 },
  { id: "category-navigation", label: "Category Navigation", depth: 0 },
  { id: "decision-detail", label: "Decision Detail", depth: 0 },
  { id: "question-context", label: "Question & Context Panel", depth: 1 },
  { id: "input-area", label: "Input Area & Notes", depth: 1 },
  { id: "input-types", label: "Input Types (7 Types)", depth: 0 },
  { id: "input-free-text", label: "Free Text", depth: 1 },
  { id: "input-single-select", label: "Single Select", depth: 1 },
  { id: "input-multi-select", label: "Multi Select", depth: 1 },
  { id: "input-numeric", label: "Numeric", depth: 1 },
  { id: "input-yes-no", label: "Yes / No Toggle", depth: 1 },
  { id: "input-file-upload", label: "File Upload", depth: 1 },
  { id: "input-data-table", label: "Data Table", depth: 1 },
  { id: "saving-confirming", label: "Saving & Confirming", depth: 0 },
  { id: "reopening", label: "Reopening Decisions", depth: 0 },
  { id: "flags-discussion", label: "Flags & Discussion", depth: 0 },
  { id: "decision-statuses", label: "Decision Statuses", depth: 0 },
  { id: "categories-reference", label: "Categories & Decisions (88)", depth: 0 },
  { id: "activity-log", label: "Activity Log", depth: 0 },
  { id: "export-publish", label: "Export & Publish", depth: 0 },
  { id: "quick-tips", label: "Quick Tips & Navigation", depth: 0 },
  { id: "troubleshooting", label: "Troubleshooting", depth: 0 },
];

/* ------------------------------------------------------------------ */
/*  Screenshot helper                                                  */
/* ------------------------------------------------------------------ */
function Screenshot({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="my-6 rounded-lg border bg-muted/30 overflow-hidden">
      <div className="relative w-full" style={{ aspectRatio: "16/10" }}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain object-top"
          sizes="(max-width: 900px) 100vw, 900px"
          unoptimized
        />
      </div>
      {caption && (
        <figcaption className="px-4 py-2 text-xs text-muted-foreground border-t bg-muted/50 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/*  Section heading                                                    */
/* ------------------------------------------------------------------ */
function H2({
  id,
  icon: Icon,
  children,
}: {
  id: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="text-2xl font-bold tracking-tight mt-14 mb-4 scroll-mt-20 flex items-center gap-2.5 border-b pb-3"
    >
      {Icon && <Icon className="w-6 h-6 text-primary shrink-0" />}
      {children}
    </h2>
  );
}

function H3({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <h3
      id={id}
      className="text-lg font-semibold tracking-tight mt-8 mb-3 scroll-mt-20"
    >
      {children}
    </h3>
  );
}

/* ------------------------------------------------------------------ */
/*  Info callout                                                       */
/* ------------------------------------------------------------------ */
function Callout({
  type = "info",
  title,
  children,
}: {
  type?: "info" | "warning" | "success" | "tip";
  title?: string;
  children: React.ReactNode;
}) {
  const styles = {
    info: "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-100",
    warning:
      "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-100",
    success:
      "bg-green-50 border-green-200 text-green-900 dark:bg-green-950/30 dark:border-green-800 dark:text-green-100",
    tip: "bg-purple-50 border-purple-200 text-purple-900 dark:bg-purple-950/30 dark:border-purple-800 dark:text-purple-100",
  };
  const icons = {
    info: HelpCircle,
    warning: AlertTriangle,
    success: CheckCircle2,
    tip: BookOpen,
  };
  const IconCmp = icons[type];
  return (
    <div className={cn("rounded-lg border px-4 py-3 my-4 text-sm", styles[type])}>
      <div className="flex items-start gap-2">
        <IconCmp className="w-4 h-4 mt-0.5 shrink-0" />
        <div>
          {title && <strong className="block mb-1">{title}</strong>}
          {children}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Status badge display                                               */
/* ------------------------------------------------------------------ */
function StatusBadge({ status, color }: { status: string; color: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        color
      )}
    >
      {status}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Main guide content                                                 */
/* ------------------------------------------------------------------ */
export function GuideContent() {
  const [tocOpen, setTocOpen] = useState(true);

  return (
    <div className="flex">
      {/* Sidebar Table of Contents */}
      <aside
        className={cn(
          "shrink-0 border-r bg-muted/20 overflow-y-auto sticky top-0 h-[calc(100vh-3.5rem)] transition-all",
          tocOpen ? "w-72" : "w-0 border-r-0"
        )}
      >
        <div className="p-4">
          <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-3 tracking-wider">
            Table of Contents
          </h3>
          <nav className="space-y-0.5">
            {TOC.map((entry) => (
              <a
                key={entry.id}
                href={`#${entry.id}`}
                className={cn(
                  "block text-sm py-1 hover:text-primary transition-colors",
                  entry.depth === 0
                    ? "font-medium text-foreground"
                    : "pl-4 text-muted-foreground text-xs"
                )}
              >
                {entry.label}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* Toggle TOC */}
      <button
        onClick={() => setTocOpen(!tocOpen)}
        className="sticky top-4 h-8 w-5 -ml-px bg-muted border rounded-r flex items-center justify-center z-10 hover:bg-accent transition-colors"
        aria-label={tocOpen ? "Close table of contents" : "Open table of contents"}
      >
        <ChevronRight
          className={cn(
            "w-3 h-3 transition-transform",
            tocOpen ? "rotate-180" : ""
          )}
        />
      </button>

      {/* Main content */}
      <article className="flex-1 max-w-4xl mx-auto px-8 py-8 pb-32">
        {/* Title */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                InsureWright Onboarding Portal
              </h1>
              <p className="text-sm text-muted-foreground">
                Complete User Guide &amp; Feature Reference
              </p>
            </div>
          </div>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            The InsureWright Onboarding Portal is a stakeholder decision platform
            built for configuring underwriting rules across the Ireland, UK &amp;
            EEA specialty MGA market. It allows the stakeholder (Neil) to answer
            88 structured decisions across 10 categories — covering appetite
            rules, data requirements, rating methodology, compliance standards,
            and more. Every decision is tracked with full audit trail,
            discussion threads, and export capabilities.
          </p>
          <p className="text-xs text-muted-foreground mt-3 italic">
            This guide is the living source of truth for all user-facing
            features and functions. It is maintained as part of the DTDD
            (Design-Test-Develop-Deploy) process and updated with every
            feature change.
          </p>
        </div>

        {/* ============================================================ */}
        {/*  1. PLATFORM OVERVIEW                                         */}
        {/* ============================================================ */}
        <H2 id="overview" icon={Layers}>
          Platform Overview
        </H2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          The Onboarding Portal provides a complete stakeholder decision
          workflow for configuring the InsureWright Extraction Engine. The
          core capabilities are:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {[
            {
              icon: Settings,
              title: "88 Stakeholder Decisions",
              desc: "Structured decisions across 10 underwriting configuration categories — from appetite rules to compliance standards.",
            },
            {
              icon: Type,
              title: "7 Input Types",
              desc: "Free text, single select, multi select, numeric, yes/no toggle, file upload, and editable data tables.",
            },
            {
              icon: Save,
              title: "Save & Confirm Workflow",
              desc: "Save answers as drafts, then confirm when ready. Reopen confirmed answers for editing at any time.",
            },
            {
              icon: Flag,
              title: "Flags & Discussion",
              desc: "Flag any decision for team discussion. Add comments and collaborate inline on each decision.",
            },
            {
              icon: Activity,
              title: "Activity Tracking",
              desc: "Complete audit trail of every change — saves, confirmations, flags, comments, and reopens are all logged.",
            },
            {
              icon: Download,
              title: "Export & Publish",
              desc: "Download decisions as JSON or Markdown, or publish configuration live to the InsureWright Extraction Engine.",
            },
          ].map((cap) => (
            <div
              key={cap.title}
              className="border rounded-lg p-3 flex gap-3 items-start"
            >
              <cap.icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{cap.title}</p>
                <p className="text-xs text-muted-foreground">{cap.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ============================================================ */}
        {/*  2. AUTHENTICATION                                            */}
        {/* ============================================================ */}
        <H2 id="authentication" icon={Lock}>
          Authentication
        </H2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          Access to the Onboarding Portal requires a 6-digit PIN. On first
          visit, you are redirected to the login page.
        </p>
        <Screenshot
          src="/guide/00-login-page.png"
          alt="Login page showing 6-digit PIN entry"
          caption="The login screen. Enter the 6-digit PIN and click Sign In."
        />

        <H3 id="pin-login">PIN Login</H3>
        <Callout type="info" title="Default PIN">
          The default PIN is <strong>220202</strong>. If your administrator
          has configured a custom PIN via the <code className="text-xs bg-muted px-1 rounded">AUTH_PIN</code> environment
          variable, use the value they provided.
        </Callout>
        <div className="text-sm space-y-2 text-muted-foreground">
          <p>
            <strong className="text-foreground">To sign in:</strong> Enter
            the 6-digit PIN in the input field and click{" "}
            <strong>Sign In</strong>. The PIN is numeric only and the input
            is masked for security. The Sign In button is disabled until
            exactly 6 digits are entered.
          </p>
          <p>
            If the PIN is incorrect, an error message appears below the input
            field. Re-enter the correct PIN and try again.
          </p>
        </div>

        <H3 id="session-signout">Session &amp; Sign Out</H3>
        <div className="text-sm space-y-2 text-muted-foreground">
          <p>
            On successful login, the system sets a secure HTTP-only cookie
            (<code className="text-xs bg-muted px-1 rounded">uw_auth</code>)
            that persists for <strong>7 days</strong>. The cookie cannot be
            read or modified by JavaScript (httpOnly).
          </p>
          <p>
            <strong className="text-foreground">To sign out:</strong> Click{" "}
            <strong>Sign Out</strong> at the bottom of the left sidebar. You
            are immediately redirected to the login page.
          </p>
          <p>
            All routes are protected by middleware. If you access any page
            without a valid session, you are automatically redirected to the
            login page. If you navigate to the login page while already
            authenticated, you are redirected to the Dashboard.
          </p>
        </div>

        {/* ============================================================ */}
        {/*  3. DASHBOARD                                                 */}
        {/* ============================================================ */}
        <H2 id="dashboard" icon={LayoutDashboard}>
          Dashboard
        </H2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          The Dashboard is the home page of the Onboarding Portal. It provides
          an at-a-glance view of your progress across all 88 decisions.
        </p>
        <Screenshot
          src="/guide/01-dashboard.png"
          alt="Dashboard showing progress overview, category cards, flagged items, and recent activity"
          caption="The dashboard home page. Shows overall progress, category cards with progress bars, flagged items, and recent activity."
        />

        <H3 id="progress-overview">Progress Overview</H3>
        <div className="text-sm space-y-2 text-muted-foreground">
          <p>
            The top of the dashboard shows a <strong className="text-foreground">Welcome, Neil</strong> greeting
            and an overall progress card displaying:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Total decisions answered out of 88</li>
            <li>Breakdown by status: confirmed, drafts, and remaining</li>
            <li>Progress bar with percentage complete</li>
          </ul>
          <p>
            The header bar also shows a quick stat counter:{" "}
            <em>&ldquo;X of 88 decisions answered&rdquo;</em>.
          </p>
        </div>

        <H3 id="category-cards">Category Cards</H3>
        <div className="text-sm space-y-2 text-muted-foreground">
          <p>
            Below the progress overview, a grid of <strong className="text-foreground">10 category cards</strong>{" "}
            displays each underwriting configuration category with:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Category icon and name</li>
            <li>Brief description of what the category covers</li>
            <li>Progress bar showing answered / total decisions</li>
            <li>
              <StatusBadge status="Flagged" color="bg-amber-100 text-amber-700" />{" "}
              badge if any decisions in the category are flagged for discussion
            </li>
            <li>
              <strong className="text-foreground">Continue</strong> button
              (navigates to the first unanswered decision) or{" "}
              <strong className="text-foreground">Review answers</strong> link
              (if all decisions are answered)
            </li>
          </ul>
        </div>

        <H3 id="flagged-activity">Flagged Items &amp; Recent Activity</H3>
        <div className="text-sm space-y-2 text-muted-foreground">
          <p>
            The bottom of the dashboard shows two side-by-side cards:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong className="text-foreground">Flagged for Discussion</strong>{" "}
              — lists up to 5 decisions that have been flagged, showing the
              decision ID, title, and category name. Click any item to navigate
              directly to that decision.
            </li>
            <li>
              <strong className="text-foreground">Recent Activity</strong>{" "}
              — shows the last 8 activity log entries with actor name,
              action summary, and timestamp.
            </li>
          </ul>
        </div>

        {/* ============================================================ */}
        {/*  4. CATEGORY NAVIGATION                                       */}
        {/* ============================================================ */}
        <H2 id="category-navigation" icon={List}>
          Category Navigation
        </H2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          Click any category in the left sidebar or any category card on the
          Dashboard to open the category overview page.
        </p>
        <Screenshot
          src="/guide/02-category-list.png"
          alt="Category list page showing decision cards with status badges and progress"
          caption="A category page listing all decisions. Each card shows the decision ID, title, status, answer preview, and navigation controls."
        />
        <div className="text-sm space-y-2 text-muted-foreground">
          <p>
            The category page shows the category name, description, and a
            progress bar at the top. Below is a list of all decisions in the
            category, each displayed as a clickable card showing:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong className="text-foreground">Order number</strong> — in a
              numbered circle
            </li>
            <li>
              <strong className="text-foreground">Decision ID</strong> — in
              monospace font (e.g.{" "}
              <code className="text-xs bg-muted px-1 rounded">ABR-001</code>)
            </li>
            <li>
              <strong className="text-foreground">Title</strong> — the decision
              title
            </li>
            <li>
              <StatusBadge status="Required" color="bg-red-100 text-red-700" />{" "}
              badge if the decision is required
            </li>
            <li>
              <strong className="text-foreground">Answer preview</strong> —
              truncated to 120 characters
            </li>
            <li>
              <Flag className="w-3 h-3 inline text-amber-500" /> icon if the
              decision is flagged for discussion
            </li>
            <li>
              <MessageSquare className="w-3 h-3 inline text-muted-foreground" />{" "}
              comment count if comments exist
            </li>
            <li>
              <strong className="text-foreground">Status badge</strong> —
              color-coded (Open, Draft, Confirmed, Implemented)
            </li>
          </ul>
          <p>
            The breadcrumb trail reads:{" "}
            <strong className="text-foreground">Dashboard</strong>{" "}
            <ChevronRight className="w-3 h-3 inline text-muted-foreground" />{" "}
            <strong className="text-foreground">Category Name</strong>.
          </p>
        </div>

        {/* ============================================================ */}
        {/*  5. DECISION DETAIL                                           */}
        {/* ============================================================ */}
        <H2 id="decision-detail" icon={FileText}>
          Decision Detail
        </H2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          Click any decision card in the category list to open its full
          detail page. This is the primary interface for answering,
          reviewing, and discussing individual decisions.
        </p>
        <Screenshot
          src="/guide/03-decision-detail.png"
          alt="Decision detail page showing question, context panel, input area, notes, and action buttons"
          caption="A decision detail page. Shows the question, collapsible context, input area, notes, and save/confirm buttons."
        />

        <H3 id="question-context">Question &amp; Context Panel</H3>
        <div className="text-sm space-y-2 text-muted-foreground">
          <p>The top of the decision page displays:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong className="text-foreground">Decision ID</strong> — in
              monospace font (e.g.{" "}
              <code className="text-xs bg-muted px-1 rounded">ABR-001</code>)
            </li>
            <li>
              <strong className="text-foreground">Status badge</strong> —
              current status with color coding
            </li>
            <li>
              <StatusBadge status="Required" color="bg-red-100 text-red-700" />{" "}
              badge if the decision is marked as required
            </li>
            <li>
              <StatusBadge status="Unsaved changes" color="bg-amber-100 text-amber-700" />{" "}
              badge when the current answer or notes differ from the last saved
              version
            </li>
            <li>
              <strong className="text-foreground">Flag button</strong> — in the
              top-right corner, toggles &ldquo;Flag for Discussion&rdquo; on
              and off
            </li>
            <li>
              <strong className="text-foreground">Title</strong> — the decision
              title in large text
            </li>
            <li>
              <strong className="text-foreground">Position indicator</strong>{" "}
              — &ldquo;Question N of M&rdquo; showing position within the
              category
            </li>
          </ul>
          <p>
            Below the header, the <strong className="text-foreground">question</strong>{" "}
            is displayed in a bordered card.
          </p>
          <p>
            A collapsible <strong className="text-foreground">&ldquo;Why this
            matters&rdquo;</strong> section can be expanded to read detailed
            context about why the decision is important and what implications
            it has. This helps inform the answer without cluttering the main
            view.
          </p>
        </div>

        <H3 id="input-area">Input Area &amp; Notes</H3>
        <div className="text-sm space-y-2 text-muted-foreground">
          <p>
            Below the question, the <strong className="text-foreground">&ldquo;Your
            Answer&rdquo;</strong> section renders the appropriate input
            component based on the decision&apos;s input type. See the{" "}
            <a href="#input-types" className="text-primary underline">Input Types</a>{" "}
            section for details on each type.
          </p>
          <p>
            Below the input, a <strong className="text-foreground">Notes (private
            scratchpad)</strong> textarea is available for adding context,
            caveats, or reminders. Notes are saved alongside the answer.
          </p>
          <p>
            When a decision is in{" "}
            <StatusBadge status="Confirmed" color="bg-green-100 text-green-700" />{" "}
            or{" "}
            <StatusBadge status="Implemented" color="bg-blue-100 text-blue-700" />{" "}
            status, both the input and notes are disabled (read-only). You must{" "}
            <a href="#reopening" className="text-primary underline">reopen</a>{" "}
            the decision to edit.
          </p>
        </div>

        {/* ============================================================ */}
        {/*  6. INPUT TYPES                                               */}
        {/* ============================================================ */}
        <H2 id="input-types" icon={Type}>
          Input Types (7 Types)
        </H2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Each decision uses one of 7 input types, chosen based on what kind
          of answer is needed. The system automatically renders the correct
          input component for each decision.
        </p>

        <H3 id="input-free-text">Free Text</H3>
        <div className="text-sm space-y-2 text-muted-foreground">
          <p>
            A multi-line <strong className="text-foreground">textarea</strong>{" "}
            for open-ended answers. The textarea displays 6 rows by default
            with a minimum height of 120px. If the decision definition includes
            placeholder text, it appears as a hint in the empty field.
          </p>
          <Callout type="tip" title="Rich Text">
            The <code className="text-xs bg-muted px-1 rounded">rich_text</code>{" "}
            input type also renders as a free text textarea. Both types use
            the same component.
          </Callout>
          <p>
            <strong className="text-foreground">Used by:</strong> ABR-003,
            ABR-007, ABR-010, ABR-013, LOB-002, LOB-003, DFR-006, DFR-007,
            DFR-010, DFR-012, DOC-003, RAT-002, RAT-005, RAT-006, RAT-007,
            WFL-001, WFL-002, WFL-005, WFL-006, WFL-007, WFL-009, ADV-004,
            ADV-007, CMP-001, CMP-002, CMP-006, CMP-007, CMP-008, CMP-009,
            QPK-001, QPK-002, QPK-007, QPK-008, MSC-004, MSC-005, MSC-006,
            MSC-008.
          </p>
        </div>

        <H3 id="input-single-select">Single Select</H3>
        <div className="text-sm space-y-2 text-muted-foreground">
          <p>
            A <strong className="text-foreground">radio group</strong> where
            you select exactly one option from a list. Each option displays a
            label and an optional description in smaller text explaining what
            the option means.
          </p>
          <p>
            Click the radio button or the label text to select an option.
            Only one option can be active at a time.
          </p>
          <p>
            <strong className="text-foreground">Used by:</strong> ABR-006,
            ABR-011, DFR-002, DFR-003, DFR-004, DFR-005, DFR-008, DOC-001,
            LOB-004, WFL-004, WFL-010, CMP-004, MSC-009.
          </p>
        </div>

        <H3 id="input-multi-select">Multi Select</H3>
        <div className="text-sm space-y-2 text-muted-foreground">
          <p>
            A <strong className="text-foreground">checkbox group</strong> where
            you can select one or more options. Each option displays a
            checkbox, label, and optional description.
          </p>
          <p>
            Click a checkbox or its label to toggle the option. The answer
            is stored as an array of selected option values.
          </p>
          <p>
            <strong className="text-foreground">Used by:</strong> LOB-001,
            DFR-011, DFR-014, DOC-002, ADV-001, ADV-003, QPK-003, CMP-010.
          </p>
        </div>

        <H3 id="input-numeric">Numeric</H3>
        <div className="text-sm space-y-2 text-muted-foreground">
          <p>
            A <strong className="text-foreground">number input</strong> with
            optional validation constraints:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong className="text-foreground">Min / Max</strong> —
              enforces a valid range
            </li>
            <li>
              <strong className="text-foreground">Step</strong> — controls
              increment size
            </li>
            <li>
              <strong className="text-foreground">Prefix</strong> — displayed
              before the input (e.g. &ldquo;&pound;&rdquo;)
            </li>
            <li>
              <strong className="text-foreground">Suffix / Unit</strong> —
              displayed after the input (e.g. &ldquo;days&rdquo;,
              &ldquo;%&rdquo;)
            </li>
          </ul>
          <Callout type="info" title="Auto-fill from Placeholder">
            When a numeric decision has a placeholder value and the status is{" "}
            <StatusBadge status="Open" color="bg-gray-100 text-gray-700" />,
            the answer is automatically pre-filled with the placeholder value.
            This allows you to confirm the default without re-typing it.
          </Callout>
          <p>
            <strong className="text-foreground">Used by:</strong> DFR-013,
            WFL-003, WFL-008, ADV-006, CMP-003, MSC-001, MSC-002, MSC-003,
            QPK-004.
          </p>
        </div>

        <H3 id="input-yes-no">Yes / No Toggle</H3>
        <div className="text-sm space-y-2 text-muted-foreground">
          <p>
            A <strong className="text-foreground">toggle switch</strong> with
            three visual states:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <span className="text-gray-500 font-medium">Not answered</span>{" "}
              — default state (gray label)
            </li>
            <li>
              <span className="text-green-600 font-medium">Yes</span>{" "}
              — switch is on (green label)
            </li>
            <li>
              <span className="text-red-600 font-medium">No</span>{" "}
              — switch is off (red label)
            </li>
          </ul>
          <p>
            <strong className="text-foreground">Used by:</strong> CMP-005.
          </p>
        </div>

        <H3 id="input-file-upload">File Upload</H3>
        <Callout type="warning" title="File Upload Not Yet Enabled">
          The file upload component displays a drag-and-drop zone but does
          not process uploads. The system shows the message:{" "}
          <em>&ldquo;File upload is not yet enabled. Please use the notes
          field below to describe what you&apos;d upload, or email files
          directly to the team.&rdquo;</em>
        </Callout>
        <div className="text-sm space-y-2 text-muted-foreground">
          <p>
            The upload zone displays an upload icon, &ldquo;Drop files here
            or click to browse&rdquo; text, and a note that PDF, Excel, and
            Word documents are accepted. Use the Notes field below the input
            to describe what you would upload.
          </p>
          <p>
            <strong className="text-foreground">Used by:</strong> DOC-004,
            RAT-001, QPK-006.
          </p>
        </div>

        <H3 id="input-data-table">Data Table</H3>
        <div className="text-sm space-y-2 text-muted-foreground">
          <p>
            An <strong className="text-foreground">editable table</strong>{" "}
            with columns defined by the decision. Each column has a type:
          </p>
          <div className="border rounded-lg overflow-hidden my-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 text-left">
                  <th className="px-4 py-2 font-medium">Column Type</th>
                  <th className="px-4 py-2 font-medium">Input Control</th>
                  <th className="px-4 py-2 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium text-foreground">text</td>
                  <td className="px-4 py-2">Text input field</td>
                  <td className="px-4 py-2">Free-form text entry</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium text-foreground">number</td>
                  <td className="px-4 py-2">Number input field</td>
                  <td className="px-4 py-2">Accepts numeric values only</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium text-foreground">select</td>
                  <td className="px-4 py-2">Dropdown menu</td>
                  <td className="px-4 py-2">Constrained to predefined options</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Use the <strong className="text-foreground">Add Row</strong> button
            to create new entries. Each row has a delete button (trash icon)
            on the right. Required columns are marked with an asterisk (*) in
            the column header.
          </p>
          <p>
            When the table is empty, a message reads: &ldquo;No entries yet.
            Click &apos;Add Row&apos; to begin.&rdquo;
          </p>
          <p>
            <strong className="text-foreground">Used by:</strong> ABR-001,
            ABR-002, ABR-004, ABR-005, ABR-008, ABR-009, ABR-012, LOB-005,
            DFR-001, DFR-009, RAT-003, RAT-004, RAT-008, ADV-002, ADV-005,
            QPK-005, MSC-007.
          </p>
        </div>

        {/* ============================================================ */}
        {/*  7. SAVING & CONFIRMING                                       */}
        {/* ============================================================ */}
        <H2 id="saving-confirming" icon={Save}>
          Saving &amp; Confirming
        </H2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          The Onboarding Portal uses a two-step workflow for finalizing
          decisions: <strong className="text-foreground">Save Draft</strong>{" "}
          and <strong className="text-foreground">Confirm Answer</strong>.
        </p>
        <div className="border rounded-lg overflow-hidden my-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 text-left">
                <th className="px-4 py-2 font-medium">Action</th>
                <th className="px-4 py-2 font-medium">What Happens</th>
                <th className="px-4 py-2 font-medium">Status After</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-t">
                <td className="px-4 py-2 font-medium text-foreground">
                  Save Draft
                </td>
                <td className="px-4 py-2">
                  Persists the current answer and notes. A toast notification
                  confirms &ldquo;Saved as draft&rdquo;.
                </td>
                <td className="px-4 py-2">
                  <StatusBadge status="Draft" color="bg-amber-50 text-amber-700" />
                </td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 font-medium text-foreground">
                  Confirm Answer
                </td>
                <td className="px-4 py-2">
                  Saves first, then locks the answer and records a
                  confirmation timestamp. A toast confirms &ldquo;Answer
                  confirmed&rdquo;. Input and notes become read-only.
                </td>
                <td className="px-4 py-2">
                  <StatusBadge status="Confirmed" color="bg-green-50 text-green-700" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="text-sm space-y-2 text-muted-foreground">
          <p>
            The <strong className="text-foreground">Save Draft</strong> button
            is disabled when there are no unsaved changes. The system detects
            unsaved changes by comparing the current answer and notes against
            the last saved values.
          </p>
          <p>
            The <strong className="text-foreground">Confirm Answer</strong>{" "}
            button is disabled when the answer is{" "}
            <code className="text-xs bg-muted px-1 rounded">null</code>{" "}
            (unanswered), except for{" "}
            <code className="text-xs bg-muted px-1 rounded">file_upload</code>{" "}
            and{" "}
            <code className="text-xs bg-muted px-1 rounded">data_table</code>{" "}
            input types, which allow confirmation without a value.
          </p>
          <p>
            A <strong className="text-foreground">Back to List</strong> button
            returns you to the category overview page.
          </p>
        </div>

        {/* ============================================================ */}
        {/*  8. REOPENING DECISIONS                                       */}
        {/* ============================================================ */}
        <H2 id="reopening" icon={RotateCcw}>
          Reopening Decisions
        </H2>
        <div className="text-sm space-y-2 text-muted-foreground">
          <p>
            When a decision is in{" "}
            <StatusBadge status="Confirmed" color="bg-green-50 text-green-700" />{" "}
            or{" "}
            <StatusBadge status="Implemented" color="bg-blue-50 text-blue-700" />{" "}
            status, the Save and Confirm buttons are replaced by a single{" "}
            <strong className="text-foreground">Reopen for Editing</strong>{" "}
            button.
          </p>
          <p>
            Clicking <strong>Reopen for Editing</strong> opens a confirmation
            dialog with the title &ldquo;Reopen this decision?&rdquo; and a
            message explaining that the status will revert from Confirmed to
            Draft. The dialog has <strong>Cancel</strong> and{" "}
            <strong>Reopen</strong> buttons.
          </p>
          <p>
            On confirmation, the status reverts to{" "}
            <StatusBadge status="Draft" color="bg-amber-50 text-amber-700" />,
            the confirmation timestamp is cleared, and the input and notes
            become editable again.{" "}
            <strong className="text-foreground">
              The previous answer is preserved
            </strong>{" "}
            — you can edit it rather than starting over.
          </p>
        </div>
        <Callout type="info" title="Audit Trail">
          Reopening a decision creates an activity log entry recording the
          status change. The original confirmation is still recorded in the
          history.
        </Callout>

        {/* ============================================================ */}
        {/*  9. FLAGS & DISCUSSION                                        */}
        {/* ============================================================ */}
        <H2 id="flags-discussion" icon={Flag}>
          Flags &amp; Discussion
        </H2>

        <H3 id="flagging">Flagging Decisions</H3>
        <div className="text-sm space-y-2 text-muted-foreground">
          <p>
            Click the <strong className="text-foreground">Flag for
            Discussion</strong> button in the top-right corner of any decision
            detail page. The button toggles between flagged (amber) and
            unflagged states.
          </p>
          <p>Flagged decisions appear in three places:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong className="text-foreground">Dashboard</strong> — in the
              &ldquo;Flagged for Discussion&rdquo; panel (up to 5 items)
            </li>
            <li>
              <strong className="text-foreground">Category list</strong> —
              as an amber flag icon on the decision card
            </li>
            <li>
              <strong className="text-foreground">Sidebar</strong> — as a
              count badge next to &ldquo;Activity Log&rdquo; showing total
              flagged items
            </li>
          </ul>
        </div>

        <H3 id="comments-section">Comments</H3>
        <div className="text-sm space-y-2 text-muted-foreground">
          <p>
            Each decision has a <strong className="text-foreground">
            Discussion</strong> section at the bottom with an inline comment
            thread. Comments show the author name, timestamp, and content.
          </p>
          <p>
            Neil&apos;s comments have a subtle primary-tinted background.
            Team comments have a muted background. To add a comment, type in
            the textarea and click <strong>Post</strong>.
          </p>
          <p>
            Every comment is recorded in the activity log as a{" "}
            <code className="text-xs bg-muted px-1 rounded">comment_added</code>{" "}
            event.
          </p>
        </div>

        {/* ============================================================ */}
        {/*  10. DECISION STATUSES                                        */}
        {/* ============================================================ */}
        <H2 id="decision-statuses" icon={CircleDot}>
          Decision Statuses
        </H2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          Every decision has one of four statuses. Status badges are
          color-coded throughout the application.
        </p>
        <div className="border rounded-lg overflow-hidden my-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 text-left">
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Badge</th>
                <th className="px-4 py-2 font-medium">Meaning</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {[
                {
                  status: "Open",
                  color: "bg-gray-100 text-gray-600",
                  meaning: "Not yet answered",
                },
                {
                  status: "Draft",
                  color: "bg-amber-50 text-amber-700",
                  meaning: "Answer saved, not yet confirmed",
                },
                {
                  status: "Confirmed",
                  color: "bg-green-50 text-green-700",
                  meaning: "Answer finalized by stakeholder",
                },
                {
                  status: "Implemented",
                  color: "bg-blue-50 text-blue-700",
                  meaning: "Built into the system",
                },
              ].map((s) => (
                <tr key={s.status} className="border-t">
                  <td className="px-4 py-2 font-medium text-foreground">
                    {s.status}
                  </td>
                  <td className="px-4 py-2">
                    <StatusBadge status={s.status} color={s.color} />
                  </td>
                  <td className="px-4 py-2">{s.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout type="info" title="Status Flow">
          The typical flow is: Open &rarr; Draft &rarr; Confirmed. The{" "}
          <strong>Implemented</strong> status is set by the development team
          after the decision has been built into the system. Confirmed
          decisions can be reopened back to Draft at any time.
        </Callout>

        {/* ============================================================ */}
        {/*  11. CATEGORIES & DECISIONS REFERENCE                         */}
        {/* ============================================================ */}
        <H2 id="categories-reference" icon={FolderOpen}>
          Categories &amp; Decisions (88)
        </H2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          The Onboarding Portal organizes 88 decisions into 10 categories.
          Each category covers a specific aspect of underwriting system
          configuration.
        </p>
        <div className="border rounded-lg overflow-hidden my-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 text-left">
                <th className="px-3 py-2 font-medium">#</th>
                <th className="px-3 py-2 font-medium">Category</th>
                <th className="px-3 py-2 font-medium">Decisions</th>
                <th className="px-3 py-2 font-medium">ID Range</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {[
                ["1", "Appetite & Business Rules", "13", "ABR-001 \u2013 ABR-013"],
                ["2", "Lines of Business & Scope", "5", "LOB-001 \u2013 LOB-005"],
                ["3", "Data Fields & Requirements", "14", "DFR-001 \u2013 DFR-014"],
                ["4", "Document Standards", "4", "DOC-001 \u2013 DOC-004"],
                ["5", "Rating Methodology", "8", "RAT-001 \u2013 RAT-008"],
                ["6", "Workflow & Standard Procedures", "10", "WFL-001 \u2013 WFL-010"],
                ["7", "Adverse News Criteria", "7", "ADV-001 \u2013 ADV-007"],
                ["8", "Compliance & Audit", "10", "CMP-001 \u2013 CMP-010"],
                ["9", "Quote Packaging", "8", "QPK-001 \u2013 QPK-008"],
                ["10", "Measures & Success Criteria", "9", "MSC-001 \u2013 MSC-009"],
              ].map(([num, name, count, range]) => (
                <tr key={num} className="border-t">
                  <td className="px-3 py-2 text-foreground font-medium">
                    {num}
                  </td>
                  <td className="px-3 py-2 font-medium text-foreground">
                    {name}
                  </td>
                  <td className="px-3 py-2">{count}</td>
                  <td className="px-3 py-2 font-mono text-xs">{range}</td>
                </tr>
              ))}
              <tr className="border-t bg-muted/30">
                <td className="px-3 py-2"></td>
                <td className="px-3 py-2 font-bold text-foreground">Total</td>
                <td className="px-3 py-2 font-bold text-foreground">88</td>
                <td className="px-3 py-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="text-sm space-y-2 text-muted-foreground">
          <p>
            Each category can be accessed directly from the sidebar navigation
            or from the Dashboard category cards. Categories are listed in
            the order shown above.
          </p>
          <p>
            Category descriptions as shown in the sidebar and Dashboard:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>
              <strong className="text-foreground">Appetite &amp; Business Rules</strong>{" "}
              — Define which risks we accept, refer, or decline based on business characteristics.
            </li>
            <li>
              <strong className="text-foreground">Lines of Business &amp; Scope</strong>{" "}
              — Which insurance lines are in scope and how they interact.
            </li>
            <li>
              <strong className="text-foreground">Data Fields &amp; Requirements</strong>{" "}
              — What information we need from broker submissions and how critical each field is.
            </li>
            <li>
              <strong className="text-foreground">Document Standards</strong>{" "}
              — What document formats and forms we accept and how they should be structured.
            </li>
            <li>
              <strong className="text-foreground">Rating Methodology</strong>{" "}
              — How premiums are calculated — rate factors, tiers, and the rating workbook.
            </li>
            <li>
              <strong className="text-foreground">Workflow &amp; Standard Procedures</strong>{" "}
              — How submissions move through the process — escalation, responses, timelines.
            </li>
            <li>
              <strong className="text-foreground">Adverse News Criteria</strong>{" "}
              — What constitutes negative findings about an applicant and how we handle them.
            </li>
            <li>
              <strong className="text-foreground">Compliance &amp; Audit</strong>{" "}
              — Regulatory requirements, record retention, and audit trail standards.
            </li>
            <li>
              <strong className="text-foreground">Quote Packaging</strong>{" "}
              — How quotes are structured, named, and presented to brokers.
            </li>
            <li>
              <strong className="text-foreground">Measures &amp; Success Criteria</strong>{" "}
              — How we measure whether the system is working correctly.
            </li>
          </ul>
        </div>

        {/* ============================================================ */}
        {/*  12. ACTIVITY LOG                                             */}
        {/* ============================================================ */}
        <H2 id="activity-log" icon={Activity}>
          Activity Log
        </H2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          The Activity Log provides a complete chronological history of all
          changes across all decisions. Access it from the{" "}
          <strong className="text-foreground">Activity Log</strong> link in
          the sidebar under Tools.
        </p>
        <Screenshot
          src="/guide/07-activity-log.png"
          alt="Activity log page showing timeline of all changes"
          caption="The Activity Log page. Every action is recorded with actor, summary, decision title, and timestamp."
        />
        <div className="text-sm space-y-2 text-muted-foreground">
          <p>
            Entries are listed newest first. When no activity exists, the
            message reads: &ldquo;No activity yet. Changes will appear here
            as you answer decisions.&rdquo;
          </p>
          <p>
            The following action types are tracked, each with a distinct icon
            and color:
          </p>
        </div>
        <div className="border rounded-lg overflow-hidden my-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 text-left">
                <th className="px-4 py-2 font-medium">Action</th>
                <th className="px-4 py-2 font-medium">Color</th>
                <th className="px-4 py-2 font-medium">When It Occurs</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {[
                ["answer_saved", "Amber", "First save of an answer"],
                ["answer_updated", "Amber", "Subsequent saves of an already-saved answer"],
                ["answer_confirmed", "Green", "Answer is confirmed"],
                ["status_changed", "Blue", "Decision reopened (confirmed \u2192 draft)"],
                ["comment_added", "Purple", "New comment posted in discussion"],
                ["file_uploaded", "Blue", "File attached to a decision"],
                ["file_removed", "Red", "File removed from a decision"],
                ["flagged", "Amber", "Decision flagged for discussion"],
                ["unflagged", "Gray", "Discussion flag removed"],
                ["marked_implemented", "Blue", "Decision marked as implemented by team"],
              ].map(([action, color, when]) => (
                <tr key={action} className="border-t">
                  <td className="px-4 py-2 font-mono text-xs text-foreground">
                    {action}
                  </td>
                  <td className="px-4 py-2">{color}</td>
                  <td className="px-4 py-2">{when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Each activity entry includes the actor name (Neil or Team), a
          summary of the action, the associated decision title, and a
          precise timestamp.
        </p>

        {/* ============================================================ */}
        {/*  13. EXPORT & PUBLISH                                         */}
        {/* ============================================================ */}
        <H2 id="export-publish" icon={Download}>
          Export &amp; Publish
        </H2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          The Export page allows you to download all decisions or publish
          the configuration live to the InsureWright Extraction Engine.
          Access it from the{" "}
          <strong className="text-foreground">Export Decisions</strong> link
          in the sidebar under Tools.
        </p>
        <Screenshot
          src="/guide/08-export-page.png"
          alt="Export page showing stats cards and three export options"
          caption="The Export page. Top stats show progress. Three export options: Markdown, JSON, and Publish."
        />
        <div className="text-sm space-y-2 text-muted-foreground">
          <p>
            The top of the page shows four stats cards:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong className="text-foreground">Total Answered</strong> —
              all decisions with a non-open status
            </li>
            <li>
              <strong className="text-foreground">Confirmed</strong> —
              decisions finalized by the stakeholder (green)
            </li>
            <li>
              <strong className="text-foreground">Draft</strong> — decisions
              saved but not yet confirmed (amber)
            </li>
            <li>
              <strong className="text-foreground">Remaining</strong> —
              decisions still in open status
            </li>
          </ul>
        </div>

        <H3 id="export-options">Export Options</H3>
        <div className="text-sm space-y-4 text-muted-foreground">
          <div className="border rounded-lg p-4">
            <p className="text-sm font-medium text-foreground mb-1">
              1. Summary Document (.md)
            </p>
            <p className="text-sm text-muted-foreground">
              Downloads a formatted Markdown file with all decisions grouped
              by category, including status icons, answers, and notes. Easy
              to read and share with stakeholders. The filename follows the
              pattern:{" "}
              <code className="text-xs bg-muted px-1 rounded">
                insurewright-onboarding-export-YYYY-MM-DD.md
              </code>
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm font-medium text-foreground mb-1">
              2. Technical Export (.json)
            </p>
            <p className="text-sm text-muted-foreground">
              Downloads a machine-readable JSON file with the complete
              decision structure: categories, slugs, decision IDs, titles,
              questions, statuses, answers, notes, and confirmation
              timestamps. Suitable for import into the build pipeline.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm font-medium text-foreground mb-1">
              3. Publish to InsureWright
            </p>
            <p className="text-sm text-muted-foreground">
              Posts the complete configuration to the InsureWright Extraction
              Engine via the{" "}
              <code className="text-xs bg-muted px-1 rounded">
                /api/config/import
              </code>{" "}
              endpoint. On success, the button shows
              &ldquo;Published v{"{N}"}&rdquo; with the version number from
              the engine&apos;s response. On failure, a &ldquo;Retry&rdquo;
              button appears with an error message.
            </p>
          </div>
        </div>
        <Callout type="info" title="Extraction Engine URL">
          The publish action sends configuration to the extraction engine at{" "}
          <code className="text-xs bg-muted px-1 rounded">
            http://localhost:8100
          </code>{" "}
          by default. Configure a different URL via the{" "}
          <code className="text-xs bg-muted px-1 rounded">
            EXTRACTION_ENGINE_URL
          </code>{" "}
          environment variable. The request has a 10-second timeout.
        </Callout>

        <p className="text-sm text-muted-foreground leading-relaxed mt-3">
          Below the export options, a <strong className="text-foreground">
          Decision Summary Preview</strong> shows all 88 decisions organized
          by category with their ID, title, status badge, and answer preview.
        </p>

        {/* ============================================================ */}
        {/*  14. QUICK TIPS                                               */}
        {/* ============================================================ */}
        <H2 id="quick-tips" icon={Hash}>
          Quick Tips &amp; Navigation
        </H2>
        <div className="border rounded-lg overflow-hidden my-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 text-left">
                <th className="px-4 py-2 font-medium">Action</th>
                <th className="px-4 py-2 font-medium">How</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {[
                ["Navigate between decisions", "Use the Previous / Next buttons at the bottom of any decision detail page"],
                ["Return to category list", "Click the Back to List button on the decision detail page"],
                ["Jump to a category", "Click any category name in the left sidebar"],
                ["See breadcrumb trail", "The header shows Dashboard \u2192 Category \u2192 Decision"],
                ["View overall progress", "Check the stat counter in the header (N of 88 decisions answered)"],
                ["Quick-start a category", "Click a category card on the Dashboard \u2014 it opens the first unanswered decision"],
                ["Toggle context panel", "Click \"Why this matters\" / \"Hide context\" on the decision detail page"],
                ["View decision answer", "Check the answer preview (120 chars) on each card in the category list"],
              ].map(([action, tip]) => (
                <tr key={action} className="border-t">
                  <td className="px-4 py-2 font-medium text-foreground">
                    {action}
                  </td>
                  <td className="px-4 py-2">{tip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ============================================================ */}
        {/*  15. TROUBLESHOOTING                                          */}
        {/* ============================================================ */}
        <H2 id="troubleshooting" icon={AlertTriangle}>
          Troubleshooting
        </H2>
        <div className="space-y-4">
          {[
            {
              q: "Cannot sign in",
              a: "Verify you are entering the correct 6-digit PIN (default: 220202). The PIN is numeric only. Contact your administrator if a custom PIN has been configured via the AUTH_PIN environment variable.",
            },
            {
              q: "Session expired \u2014 redirected to login",
              a: "The session lasts 7 days. After that, you must re-enter the PIN. The uw_auth cookie is httpOnly and cannot be read or modified by JavaScript.",
            },
            {
              q: "Changes not saving",
              a: "Ensure you click \"Save Draft\" before navigating away. The amber \"Unsaved changes\" badge appears when changes are pending. Navigation away from the page without saving will lose unsaved changes.",
            },
            {
              q: "Confirm button is disabled",
              a: "You must provide an answer before confirming. The Confirm button is disabled when the answer is null (unanswered), except for file_upload and data_table input types which allow confirmation without a value. For numeric inputs, a default value from the placeholder is pre-filled automatically.",
            },
            {
              q: "Cannot edit a confirmed answer",
              a: "Click \"Reopen for Editing\" to change a confirmed decision back to Draft status. A confirmation dialog appears. Your previous answer is preserved \u2014 you can edit it rather than starting over.",
            },
            {
              q: "File upload not working",
              a: "File upload is UI-only and not yet enabled. Use the notes field below the input to describe what you would upload, or email files directly to the team.",
            },
            {
              q: "Publish fails with connection error",
              a: "The InsureWright Extraction Engine must be running at the configured URL (default: http://localhost:8100). Check that the engine is started and accessible. The publish action has a 10-second timeout \u2014 check network connectivity if it times out.",
            },
            {
              q: "Export downloads an empty-looking file",
              a: "If no decisions have been answered, the export will contain the category structure with empty/null answers. Answer at least one decision before exporting.",
            },
            {
              q: "Activity log is empty",
              a: "Activity entries are created when you save, confirm, reopen, flag, or comment on decisions. Start by answering and saving a decision to see your first activity entry.",
            },
          ].map((item) => (
            <div key={item.q} className="border rounded-lg p-4">
              <p className="text-sm font-medium text-foreground mb-1">
                {item.q}
              </p>
              <p className="text-sm text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-6 border-t text-center">
          <p className="text-xs text-muted-foreground">
            InsureWright Onboarding Portal User Guide
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            This guide is automatically maintained as part of the DTDD
            process.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: {new Date().toISOString().split("T")[0]}
          </p>
        </div>
      </article>
    </div>
  );
}
