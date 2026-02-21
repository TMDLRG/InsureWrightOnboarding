import { Category, DecisionDefinition } from "./types";

// ============================================================
// CATEGORIES
// ============================================================

export const CATEGORIES: Category[] = [
  {
    slug: "appetite-business-rules",
    name: "Appetite & Business Rules",
    description:
      "Define which risks we accept, refer, or decline based on business characteristics.",
    icon: "ShieldCheck",
    order: 1,
  },
  {
    slug: "lines-of-business",
    name: "Lines of Business & Scope",
    description:
      "Which insurance lines are in scope and how they interact.",
    icon: "Layers",
    order: 2,
  },
  {
    slug: "data-fields-requirements",
    name: "Data Fields & Requirements",
    description:
      "What information we need from broker submissions and how critical each field is.",
    icon: "ClipboardList",
    order: 3,
  },
  {
    slug: "document-standards",
    name: "Document Standards",
    description:
      "What document formats and forms we accept and how they should be structured.",
    icon: "FileText",
    order: 4,
  },
  {
    slug: "rating-methodology",
    name: "Rating Methodology",
    description:
      "How premiums are calculated — rate factors, tiers, and the rating workbook.",
    icon: "Calculator",
    order: 5,
  },
  {
    slug: "workflow-sops",
    name: "Workflow & Standard Procedures",
    description:
      "How submissions move through the process — escalation, responses, timelines.",
    icon: "GitBranch",
    order: 6,
  },
  {
    slug: "adverse-news-criteria",
    name: "Adverse News Criteria",
    description:
      "What constitutes negative findings about an applicant and how we handle them.",
    icon: "Search",
    order: 7,
  },
  {
    slug: "compliance-audit",
    name: "Compliance & Audit",
    description:
      "Regulatory requirements, record retention, and audit trail standards.",
    icon: "Lock",
    order: 8,
  },
  {
    slug: "quote-packaging",
    name: "Quote Packaging",
    description:
      "How quotes are structured, named, and presented to brokers.",
    icon: "Package",
    order: 9,
  },
  {
    slug: "measures-success-criteria",
    name: "Measures & Success Criteria",
    description:
      "How we measure whether the system is working correctly.",
    icon: "Target",
    order: 10,
  },
];

// ============================================================
// DECISION DEFINITIONS — 88 items across 10 categories
// Regionalized for Ireland / UK / EEA delegated authority MGAs
// ============================================================

export const DECISIONS: DecisionDefinition[] = [
  // =====================================================
  // CATEGORY 1: APPETITE & BUSINESS RULES  (ABR-001 → ABR-013)
  // =====================================================
  {
    id: "ABR-001",
    categorySlug: "appetite-business-rules",
    title: "Turnover Thresholds by Line",
    question:
      "What are the maximum and minimum annual turnover thresholds for each line of business we write?",
    context:
      "Turnover limits determine which submissions fall within our appetite. Submissions outside these thresholds are either auto-declined or referred to a senior underwriter. We need specific GBP/EUR amounts per line of business (e.g., Public Liability maximum £50M/€55M, Employers' Liability maximum £25M/€28M). The current prototype uses a single £50M cap for all lines.",
    inputType: "data_table",
    tableColumns: [
      { key: "line", label: "Line of Business", type: "text", required: true },
      { key: "minTurnover", label: "Minimum Turnover (£/€)", type: "number", required: true },
      { key: "maxTurnover", label: "Maximum Turnover (£/€)", type: "number", required: true },
      {
        key: "action",
        label: "If Outside Range",
        type: "select",
        options: [
          { value: "decline", label: "Decline" },
          { value: "refer", label: "Refer to Senior UW" },
          { value: "request", label: "Request More Info" },
        ],
      },
    ],
    required: true,
    order: 1,
  },
  {
    id: "ABR-002",
    categorySlug: "appetite-business-rules",
    title: "UK SIC / NACE Industry Blocklist",
    question:
      "Which industry codes (UK SIC 2007 / NACE Rev. 2.1) should be automatically excluded from consideration?",
    context:
      "Certain industries are entirely outside our risk appetite. We need the specific UK SIC 2007 codes (or NACE Rev. 2.1 for EEA submissions) and the reason for exclusion. For example, tobacco manufacturing (12.00), weapons and ammunition (25.40), gambling activities (92.00). Any submission with a blocked industry code would be auto-declined without further review.",
    inputType: "data_table",
    tableColumns: [
      { key: "industryCode", label: "Industry Code (UK SIC / NACE)", type: "text", required: true },
      { key: "description", label: "Industry", type: "text", required: true },
      { key: "reason", label: "Reason for Exclusion", type: "text", required: true },
    ],
    placeholder: "Add each excluded UK SIC / NACE code as a row",
    required: true,
    order: 2,
  },
  {
    id: "ABR-003",
    categorySlug: "appetite-business-rules",
    title: "Payroll-to-Turnover Ratio",
    question:
      "At what payroll-to-turnover ratio should a submission be flagged? Does this vary by industry or line?",
    context:
      "An unusually high payroll relative to turnover can indicate labour-intensive operations with higher employers' liability exposure. The current spec uses a 30% threshold. We need to confirm this ratio and whether it differs by UK SIC code or line of business.",
    inputType: "free_text",
    placeholder:
      "e.g., If annual payroll exceeds 30% of annual turnover, refer to senior underwriter. For construction (UK SIC Division 41-43), threshold is 45%...",
    required: true,
    order: 3,
  },
  {
    id: "ABR-004",
    categorySlug: "appetite-business-rules",
    title: "Construction Type Restrictions",
    question:
      "Which building construction types should trigger a referral or decline for property cover?",
    context:
      "Construction type directly affects property risk. UK construction classifications include fire-resistive, non-combustible, limited combustible, combustible, and timber frame. Classification affects property rating and may reference Building Regulations (Part B fire safety in England/Wales) or equivalent Irish standards (Part B of the Irish Building Regulations). Timber frame construction is often excluded or heavily surcharged.",
    inputType: "data_table",
    tableColumns: [
      { key: "type", label: "Construction Type", type: "text", required: true },
      {
        key: "action",
        label: "Action",
        type: "select",
        options: [
          { value: "accept", label: "Accept" },
          { value: "refer", label: "Refer" },
          { value: "decline", label: "Decline" },
          { value: "surcharge", label: "Accept with Surcharge" },
        ],
      },
      { key: "notes", label: "Notes", type: "text" },
    ],
    required: true,
    order: 4,
  },
  {
    id: "ABR-005",
    categorySlug: "appetite-business-rules",
    title: "Loss Ratio Thresholds",
    question:
      "What historical loss ratio triggers a referral or decline? Over what period (3 years, 5 years)?",
    context:
      "Loss ratio (incurred losses / earned premium) is a key underwriting metric. A high loss ratio over the prior period indicates poor risk performance. We need the specific threshold (e.g., 75%), the lookback period, and whether this varies by line of business.",
    inputType: "data_table",
    tableColumns: [
      { key: "line", label: "Line of Business", type: "text", required: true },
      {
        key: "period",
        label: "Lookback Period",
        type: "select",
        options: [
          { value: "3_years", label: "3 Years" },
          { value: "5_years", label: "5 Years" },
          { value: "7_years", label: "7 Years" },
          { value: "10_years", label: "10 Years" },
        ],
        required: true,
      },
      { key: "referThreshold", label: "Refer If Above (%)", type: "number", required: true },
      { key: "declineThreshold", label: "Decline If Above (%)", type: "number" },
    ],
    required: true,
    order: 5,
  },
  {
    id: "ABR-006",
    categorySlug: "appetite-business-rules",
    title: "Missing Data Handling",
    question:
      "When required information is missing from a submission, should the system auto-refer, send a data request to the broker, or decline?",
    context:
      "Broker submissions are often incomplete. The system needs a consistent policy for handling gaps. Options include: automatically referring to a senior underwriter, generating a targeted data-request memo to the broker listing what's missing and why, or declining incomplete submissions outright.",
    inputType: "single_select",
    options: [
      {
        value: "refer",
        label: "Auto-refer to Senior UW",
        description: "Send incomplete submissions to a senior underwriter for manual review",
      },
      {
        value: "request",
        label: "Send data request to broker",
        description:
          "Generate a specific memo listing missing items and why each is needed",
      },
      {
        value: "decline",
        label: "Decline incomplete submissions",
        description: "Reject submissions that are missing required fields",
      },
      {
        value: "depends",
        label: "Depends on what's missing",
        description:
          "Different handling based on which fields are missing (define rules per field)",
      },
    ],
    required: true,
    order: 6,
  },
  {
    id: "ABR-007",
    categorySlug: "appetite-business-rules",
    title: "Pass / Refer / Decline Definitions",
    question:
      "Define exactly what 'pass,' 'refer,' and 'decline' mean in our underwriting process.",
    context:
      "These three outcomes drive the entire triage system. 'Pass' means auto-quotable within junior UW authority. 'Refer' means escalation to a senior underwriter who may still approve. 'Decline' means outside appetite with no path to approval. We need precise operational definitions including authority levels.",
    inputType: "free_text",
    placeholder:
      "Pass: Submission meets all appetite rules and can be quoted by the system without human review.\n\nRefer: Submission triggers one or more referral rules. A senior underwriter reviews and may approve, modify terms, or decline.\n\nDecline: Submission violates a hard-stop rule (e.g., blocked industry code (UK SIC), excessive loss history). No override available.",
    required: true,
    order: 7,
  },
  {
    id: "ABR-008",
    categorySlug: "appetite-business-rules",
    title: "Auto-Decline Rules (No Waiver)",
    question:
      "Which specific rule failures result in an automatic decline that cannot be overridden?",
    context:
      "Some underwriting criteria represent absolute boundaries. For example, a blocked industry code, OFSI/EU sanctions match, or uninsurable risk class may be a hard decline regardless of other factors. We need the complete list of 'no-waiver' rules so the system can auto-decline without referral.",
    inputType: "data_table",
    tableColumns: [
      { key: "rule", label: "Rule Name", type: "text", required: true },
      { key: "field", label: "Field Checked", type: "text", required: true },
      { key: "condition", label: "Decline Condition", type: "text", required: true },
      { key: "reason", label: "Decline Reason", type: "text", required: true },
    ],
    required: true,
    order: 8,
  },
  {
    id: "ABR-009",
    categorySlug: "appetite-business-rules",
    title: "Referral Rules (Senior UW Override)",
    question:
      "Which rule failures should trigger a referral that a senior underwriter can override?",
    context:
      "Referral rules identify submissions that need human judgment but aren't automatic declines. For example, turnover slightly above threshold, or a single large claim in otherwise clean history. We need each rule with its trigger condition and the information the senior UW needs to make their decision.",
    inputType: "data_table",
    tableColumns: [
      { key: "rule", label: "Rule Name", type: "text", required: true },
      { key: "field", label: "Field Checked", type: "text", required: true },
      { key: "condition", label: "Referral Condition", type: "text", required: true },
      { key: "infoNeeded", label: "What Senior UW Needs to See", type: "text", required: true },
    ],
    required: true,
    order: 9,
  },
  {
    id: "ABR-010",
    categorySlug: "appetite-business-rules",
    title: "Unknown / Unverifiable Data",
    question:
      "When the system extracts a value but cannot verify it (low confidence), what should happen?",
    context:
      "The extraction pipeline may find a value but flag it as uncertain — for example, a turnover figure extracted from a footnote rather than a clearly labelled field. This 'unknown' state is different from 'missing.' We need a policy: treat as missing? Accept with a flag? Auto-refer?",
    inputType: "free_text",
    placeholder:
      "e.g., Flag the field as 'needs review' and include it in the referral memo. If more than 3 fields are flagged, auto-refer the entire submission...",
    required: true,
    order: 10,
  },
  {
    id: "ABR-011",
    categorySlug: "appetite-business-rules",
    title: "Gap Severity Levels",
    question:
      "Should missing fields be classified by severity? If so, what levels and what triggers each?",
    context:
      "Not all missing data is equally important. A missing Company Registration Number may just need a quick follow-up (info), while missing claims history may block the entire review (blocker). Proposed levels: Info (nice to have), Warning (should have, can proceed with flag), Blocker (must have, cannot proceed).",
    inputType: "single_select",
    options: [
      {
        value: "three_levels",
        label: "Three levels: Info / Warning / Blocker",
        description:
          "Classify each missing field by impact on the underwriting decision",
      },
      {
        value: "two_levels",
        label: "Two levels: Required / Optional",
        description: "Simpler approach — a field is either needed or not",
      },
      {
        value: "single_level",
        label: "All missing fields treated equally",
        description: "Any missing field triggers the same action",
      },
    ],
    required: true,
    order: 11,
  },
  {
    id: "ABR-012",
    categorySlug: "appetite-business-rules",
    title: "Complete Appetite Rule Set",
    question:
      "Define all underwriting rules the system should enforce. Add each rule as a row in the table below.",
    context:
      "The system needs 15-20 formal rules covering key underwriting criteria across all lines of business. Currently only 3 rules are implemented (turnover cap, missing claims history, missing prior insurer). We need the complete set. Add rules in the table below, and use the notes field for any additional context or to reference external documents.",
    inputType: "data_table",
    tableColumns: [
      {
        key: "ruleName",
        label: "Rule Name",
        type: "text",
        required: true,
      },
      {
        key: "condition",
        label: "Criteria / Condition",
        type: "text",
        required: true,
      },
      {
        key: "action",
        label: "Action",
        type: "select",
        required: true,
        options: [
          { value: "accept", label: "Accept" },
          { value: "refer", label: "Refer" },
          { value: "decline", label: "Decline" },
          { value: "flag", label: "Flag for Review" },
        ],
      },
      {
        key: "lob",
        label: "Line of Business",
        type: "select",
        options: [
          { value: "all", label: "All Lines" },
          { value: "public_liability", label: "Public Liability" },
          { value: "property", label: "Property" },
          { value: "el", label: "Employers' Liability" },
          { value: "motor", label: "Commercial Motor" },
          { value: "excess", label: "Excess of Loss" },
          { value: "pi", label: "Professional Indemnity" },
          { value: "commercial_combined", label: "Commercial Combined" },
        ],
      },
    ],
    required: true,
    order: 12,
  },
  {
    id: "ABR-013",
    categorySlug: "appetite-business-rules",
    title: "Rule Change Process",
    question:
      "How are appetite rules updated over time? Who approves changes? How is version history maintained?",
    context:
      "Appetite rules evolve as the book of business matures and market conditions change. We need to understand the governance process so the system can support versioning, audit trails, and proper authorisation for rule changes.",
    inputType: "free_text",
    placeholder:
      "e.g., Rules are reviewed quarterly by the underwriting committee. Changes require sign-off from the Chief Underwriting Officer. All prior versions are retained for audit...",
    required: false,
    order: 13,
  },

  // =====================================================
  // CATEGORY 2: LINES OF BUSINESS & SCOPE  (LOB-001 → LOB-005)
  // =====================================================
  {
    id: "LOB-001",
    categorySlug: "lines-of-business",
    title: "Lines in Scope",
    question:
      "Which lines of business will the underwriting system handle? Select all that apply.",
    context:
      "Each line of business has different data requirements, rating approaches, and regulatory considerations. We need to know the full scope so the system handles all relevant lines. The current prototype only handles Public Liability.",
    inputType: "multi_select",
    options: [
      { value: "public_liability", label: "Public Liability / Products Liability" },
      { value: "el", label: "Employers' Liability (EL)" },
      { value: "property", label: "Commercial Property" },
      { value: "do", label: "Directors & Officers (D&O)" },
      { value: "excess", label: "Excess of Loss" },
      { value: "commercial_combined", label: "Commercial Combined" },
      { value: "pi", label: "Professional Indemnity (PI)" },
      { value: "motor", label: "Commercial Motor" },
    ],
    required: true,
    order: 1,
  },
  {
    id: "LOB-002",
    categorySlug: "lines-of-business",
    title: "Multi-Line Bundling",
    question:
      "Do you offer premium discounts for multi-line bundles? How is this structured?",
    context:
      "Many MGAs offer package discounts when an insured buys multiple covers. We need to know if bundling applies, which combinations qualify, and the discount structure (e.g., 5% discount for Public Liability + Property, 10% for 3+ lines).",
    inputType: "free_text",
    placeholder:
      "e.g., 5% package discount for any 2-line combination. 10% for 3+ lines. Commercial Combined bundles Public Liability + Property + Employers' Liability at a blended rate...",
    required: true,
    order: 2,
  },
  {
    id: "LOB-003",
    categorySlug: "lines-of-business",
    title: "Line-Specific Appetite Differences",
    question:
      "Do appetite rules differ by line of business? Describe any line-specific variations.",
    context:
      "Turnover thresholds, UK SIC restrictions, or loss ratio triggers may be different for Public Liability vs. Employers' Liability vs. Property. For example, the EL appetite may be more restrictive on high-hazard trades than Public Liability. We need to know where the rules diverge.",
    inputType: "free_text",
    placeholder:
      "e.g., EL: Exclude all construction trades above risk category 5 (UK SIC Division 41-43). Property: Require fire suppression system for buildings over 5,000 sq m. Reference Building Regulations Part B (England/Wales) or equivalent Irish standards. Public Liability: No specific restrictions beyond the general appetite...",
    required: true,
    order: 3,
  },
  {
    id: "LOB-004",
    categorySlug: "lines-of-business",
    title: "Rating Approach",
    question:
      "Are lines rated independently, as a combined package, or both options available?",
    context:
      "The rating workbook may price each line separately (Public Liability premium + EL premium + Property premium) or use a blended approach. This affects how the system calls the rater and presents quote options.",
    inputType: "single_select",
    options: [
      { value: "independent", label: "Rate each line independently" },
      { value: "combined", label: "Single combined/package rate" },
      { value: "both", label: "Both options (broker chooses)" },
    ],
    required: true,
    order: 4,
  },
  {
    id: "LOB-005",
    categorySlug: "lines-of-business",
    title: "Limit & Excess Structures",
    question:
      "For each line, what limit options and excess options are available?",
    context:
      "Quote options are built from available limit/excess combinations. We need to know the standard offerings per line — for example, Public Liability might offer £1M/£2M any one claim/in the aggregate with £5K/£10K/£25K excess options.",
    inputType: "data_table",
    tableColumns: [
      { key: "line", label: "Line of Business", type: "text", required: true },
      { key: "limits", label: "Available Limits", type: "text", required: true },
      { key: "excess", label: "Excess Options", type: "text", required: true },
      { key: "standardTerms", label: "Standard Terms", type: "text" },
    ],
    required: true,
    order: 5,
  },

  // =====================================================
  // CATEGORY 3: DATA FIELDS & REQUIREMENTS  (DFR-001 → DFR-014)
  // =====================================================
  {
    id: "DFR-001",
    categorySlug: "data-fields-requirements",
    title: "Field Requirement Levels",
    question:
      "For each data field, is it Required (must have to proceed), Optional (helpful but not blocking), or Not Needed?",
    context:
      "The extraction pipeline pulls many fields from broker submissions. We need to classify each one so the system knows what triggers a data request vs. what's just nice to have. This directly controls gap detection and data-request memo generation.",
    inputType: "data_table",
    tableColumns: [
      { key: "field", label: "Field Name", type: "text", required: true },
      {
        key: "level",
        label: "Requirement",
        type: "select",
        options: [
          { value: "required", label: "Required" },
          { value: "optional", label: "Optional" },
          { value: "not_needed", label: "Not Needed" },
        ],
        required: true,
      },
      { key: "notes", label: "Notes / Conditions", type: "text" },
    ],
    placeholder: "Fields: Named Insured, Company Registration Number, VAT Number, UK SIC / NACE Code, Turnover, Payroll, Period of Insurance, Public Liability Limit, Prior Insurer, Claims History, Years Trading, Employee Count / Headcount, Property Values, Directors/Partners, Business Description, Entity Type (Ltd/PLC/LLP/Sole Trader), Broker Contact, Registered Address, Trading Address",
    required: true,
    order: 1,
  },
  {
    id: "DFR-002",
    categorySlug: "data-fields-requirements",
    title: "Trading Name",
    question:
      "Should we capture the trading name (t/a) separately from the legal entity name? Is the trading name used in adverse news searches?",
    context:
      "Some companies operate under a different name than their legal entity. Capturing the trading name separately helps with adverse news screening (searching both names) and ensures the policy is issued correctly.",
    inputType: "single_select",
    options: [
      {
        value: "required_separate",
        label: "Yes, capture separately and use for adverse news",
      },
      {
        value: "optional",
        label: "Capture if available, not required",
      },
      {
        value: "not_needed",
        label: "Not needed — legal name is sufficient",
      },
    ],
    required: true,
    order: 2,
  },
  {
    id: "DFR-003",
    categorySlug: "data-fields-requirements",
    title: "Entity Type",
    question:
      "Does the entity type (Ltd, PLC, LLP, Partnership, Sole Trader) affect rating or appetite decisions?",
    context:
      "Entity type can affect liability exposure and cover structure. For example, sole traders may have different employers' liability requirements than limited companies. If entity type matters for rating or triage, we need to extract and validate it.",
    inputType: "single_select",
    options: [
      { value: "affects_rating", label: "Yes, it affects rating and/or appetite" },
      { value: "informational", label: "Capture for reference, doesn't affect decisions" },
      { value: "not_needed", label: "Not needed" },
    ],
    required: true,
    order: 3,
  },
  {
    id: "DFR-004",
    categorySlug: "data-fields-requirements",
    title: "UK SIC 2007 vs. NACE Rev. 2.1",
    question:
      "Should we use UK SIC 2007 as the primary industry classification, accept NACE Rev. 2.1 codes from EEA submissions, or require a specific standard?",
    context:
      "UK SIC 2007 is the standard classification for UK establishments and maps closely to NACE Rev. 2.1 used across the EEA. Irish submissions may use either. We need to determine the primary classification system and whether automatic mapping between UK SIC and NACE is acceptable.",
    inputType: "single_select",
    options: [
      { value: "uk_sic_only", label: "Require UK SIC 2007 — request if only NACE provided" },
      { value: "accept_nace", label: "Accept NACE Rev. 2.1 and auto-map to UK SIC" },
      { value: "accept_either", label: "Accept either without conversion" },
    ],
    required: true,
    order: 4,
  },
  {
    id: "DFR-005",
    categorySlug: "data-fields-requirements",
    title: "Business Description",
    question:
      "Should we capture a free-text business description from the broker, or must it map to a specific classification code?",
    context:
      "Free-text descriptions are useful for underwriter context but hard to use in automated rules. A coded classification (UK SIC / NACE) is machine-readable but may miss nuances. We need to know if both are needed.",
    inputType: "single_select",
    options: [
      { value: "both", label: "Capture both free-text and classification code" },
      { value: "code_only", label: "Classification code is sufficient" },
      { value: "free_text", label: "Free-text description is sufficient" },
    ],
    required: true,
    order: 5,
  },
  {
    id: "DFR-006",
    categorySlug: "data-fields-requirements",
    title: "Address Requirements",
    question:
      "Do we need both the registered address and each trading/operating address? How are they used?",
    context:
      "Registered address is for correspondence and Companies House records. Operating/trading addresses affect property rating — postcode (UK) or Eircode (Ireland) enables geocoding for flood risk zones (Environment Agency in England, SEPA in Scotland, OPW in Ireland), subsidence risk, and coastal erosion. The property schedule typically lists each location.",
    inputType: "free_text",
    placeholder:
      "e.g., Capture registered address and all trading/operating locations. All operating locations required for property rating — need full address including postcode (UK) or Eircode (Ireland) for geocoding to determine flood risk zone and subsidence risk...",
    required: true,
    order: 6,
  },
  {
    id: "DFR-007",
    categorySlug: "data-fields-requirements",
    title: "Management Tenure",
    question:
      "Should we track 'years under current management' separately from 'years in business'? Is there a threshold that triggers review?",
    context:
      "A business may have been operating for 20 years but under new ownership for only 1 year. New management can change the risk profile. If relevant, we need to know the threshold (e.g., refer if management tenure < 3 years).",
    inputType: "free_text",
    placeholder:
      "e.g., Track separately. If current management < 3 years, refer for senior review regardless of company age...",
    required: false,
    order: 7,
  },
  {
    id: "DFR-008",
    categorySlug: "data-fields-requirements",
    title: "Excess Preference",
    question:
      "Does the broker specify a requested excess, or is the excess determined entirely by the rating model?",
    context:
      "Some brokers submit with a specific excess in mind. Others expect the insurer to propose options. This affects whether 'requested excess' is an extracted field or only an output of the rating engine.",
    inputType: "single_select",
    options: [
      { value: "broker_requests", label: "Broker specifies preferred excess" },
      { value: "system_determines", label: "System determines excess from rating" },
      { value: "both", label: "Broker may request, but system proposes options" },
    ],
    required: true,
    order: 8,
  },
  {
    id: "DFR-009",
    categorySlug: "data-fields-requirements",
    title: "Claims History Detail Level",
    question:
      "What specific fields do we need from each claims history entry? Define the structured data per claim.",
    context:
      "Claims history is one of the most critical underwriting inputs. It can range from a simple summary (3 claims, £200K/€220K total) to detailed per-claim records. We need to know exactly what fields to extract per claim for the triage rules and rating model.",
    inputType: "data_table",
    tableColumns: [
      { key: "field", label: "Field Name", type: "text", required: true },
      {
        key: "required",
        label: "Required?",
        type: "select",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ],
        required: true,
      },
      { key: "usage", label: "How It's Used", type: "text" },
    ],
    placeholder: "Suggested fields: Claim Number, Date of Loss, Date Reported, Claim Status, Cause of Loss, Paid Amount, Reserved Amount, Incurred Amount, Defence Costs, Subrogation Recovery",
    required: true,
    order: 9,
  },
  {
    id: "DFR-010",
    categorySlug: "data-fields-requirements",
    title: "Directors / Persons of Significant Control",
    question:
      "Do we need to capture the names, positions, and shareholding/control percentages of company directors and persons of significant control (PSCs)? Are these used for adverse news screening?",
    context:
      "Director and PSC names can be screened against OFSI consolidated sanctions list, EU consolidated sanctions list, and adverse news sources. The Companies House PSC register lists persons with >25% significant control. Understanding who owns/controls the business is critical for delegated authority compliance.",
    inputType: "free_text",
    placeholder:
      "e.g., Capture all directors and persons of significant control (>25% shareholding/voting rights per Companies House PSC register). Include name, position, control percentage. Screen each against OFSI/EU sanctions and adverse news sources. Any match triggers a referral...",
    required: true,
    order: 10,
  },
  {
    id: "DFR-011",
    categorySlug: "data-fields-requirements",
    title: "Statement of Values (SOV) Detail",
    question:
      "Which property schedule fields do we need per location? Select all that apply.",
    context:
      "The Statement of Values (SOV) describes each insured location. Different fields feed into property rating, catastrophe modelling, and underwriting judgment. COPE (Construction, Occupancy, Protection, Exposure) is the standard framework.",
    inputType: "multi_select",
    options: [
      { value: "construction", label: "Construction type (fire-resistive / non-combustible / timber frame etc.)" },
      { value: "occupancy", label: "Occupancy class" },
      { value: "protection", label: "Fire protection (sprinklers, fire alarm category, distance to fire station)" },
      { value: "exposure", label: "Exposure (EA/SEPA/OPW flood zone, subsidence risk, coastal erosion)" },
      { value: "sqm", label: "Floor area (sq m)" },
      { value: "year_built", label: "Year built" },
      { value: "sprinklers", label: "Sprinkler details" },
      { value: "alarms", label: "Alarm/security systems" },
      { value: "roof", label: "Roof type and age" },
      { value: "building_value", label: "Building value" },
      { value: "contents_value", label: "Contents value" },
      { value: "bi_value", label: "Business income value" },
      { value: "equipment_value", label: "Equipment value" },
    ],
    required: true,
    order: 11,
  },
  {
    id: "DFR-012",
    categorySlug: "data-fields-requirements",
    title: "TIV Calculation",
    question:
      "How should Total Insured Value (TIV) be calculated? Is it always Building + Contents + Business Income + Equipment?",
    context:
      "TIV drives property rating and may have different definitions depending on the cover form. Some exclude business income, others include extra expense. We need the canonical formula.",
    inputType: "free_text",
    placeholder:
      "e.g., TIV = Building Value + Contents Value + Business Income (12 months) + Equipment Value. If any component is missing, use replacement cost estimates...",
    required: true,
    order: 12,
  },
  {
    id: "DFR-013",
    categorySlug: "data-fields-requirements",
    title: "Claims History Staleness",
    question:
      "How old can claims history/bordereaux be before we require updated versions? (The spec suggests 90 days.)",
    context:
      "Claims bordereaux have a valuation date. If the valuation date is too far in the past, the data may not reflect recent claims. Market standard is typically 90 days; Lloyd's coverholder arrangements may specify different requirements in the binder.",
    inputType: "numeric",
    numericValidation: {
      min: 30,
      max: 365,
      step: 1,
      suffix: "days",
    },
    placeholder: "90",
    required: true,
    order: 13,
  },
  {
    id: "DFR-014",
    categorySlug: "data-fields-requirements",
    title: "Contact Information Requirements",
    question:
      "Which broker/applicant contact fields are required for processing?",
    context:
      "Contact information is needed for data requests, policy issuance, and ongoing communication. We need to know the minimum required contact fields.",
    inputType: "multi_select",
    options: [
      { value: "contact_name", label: "Contact Name" },
      { value: "contact_phone", label: "Phone Number" },
      { value: "contact_email", label: "Email Address" },
      { value: "broker_name", label: "Broker/Agency Name" },
      { value: "broker_fca_frn", label: "Broker FCA FRN / CBI Registration Number" },
    ],
    required: true,
    order: 14,
  },

  // =====================================================
  // CATEGORY 4: DOCUMENT STANDARDS  (DOC-001 → DOC-004)
  // =====================================================
  {
    id: "DOC-001",
    categorySlug: "document-standards",
    title: "Standard Submission Format",
    question:
      "Should we require Market Reform Contract (MRC) format, accept Lloyd's placing slips, or accept broker submissions in any format?",
    context:
      "In the London/Dublin market, the Market Reform Contract (MRC) provides a standardised placing structure. Lloyd's submissions typically follow the placing slip format. Many brokers submit via their own presentation documents. Requiring MRC format improves extraction reliability but reduces broker flexibility.",
    inputType: "single_select",
    options: [
      { value: "mrc_required", label: "Require MRC / standard placing slip format" },
      { value: "mrc_preferred", label: "Prefer MRC format, accept other broker presentations" },
      { value: "any", label: "Accept any format" },
    ],
    required: true,
    order: 1,
  },
  {
    id: "DOC-002",
    categorySlug: "document-standards",
    title: "Accepted File Types",
    question:
      "Which document file types should the system accept? Select all that apply.",
    context:
      "Different file types require different processing pipelines. Native PDFs have selectable text; scanned PDFs need OCR. Word documents have their own extraction path. Supporting more types increases flexibility but adds complexity.",
    inputType: "multi_select",
    options: [
      { value: "pdf_native", label: "Native PDF (selectable text)" },
      { value: "pdf_scanned", label: "Scanned PDF (image-based, needs OCR)" },
      { value: "docx", label: "Word Documents (.docx)" },
      { value: "xlsx", label: "Excel Spreadsheets (.xlsx)" },
      { value: "email", label: "Email submissions (.eml / .msg)" },
    ],
    required: true,
    order: 2,
  },
  {
    id: "DOC-003",
    categorySlug: "document-standards",
    title: "Table Structure Expectations",
    question:
      "Are property schedules and claims bordereaux typically presented in formatted tables within submissions?",
    context:
      "Table extraction is more reliable when data is in actual bordered tables vs. free-text or space-separated columns. Understanding the typical format helps us choose the right extraction approach and set accuracy expectations.",
    inputType: "free_text",
    placeholder:
      "e.g., Property schedules are almost always in tables (address, sq m, construction, year built per row). Claims bordereaux vary — some insurers provide formatted tables, others provide paragraph-style summaries...",
    required: true,
    order: 3,
  },
  {
    id: "DOC-004",
    categorySlug: "document-standards",
    title: "Sample Real Submissions",
    question:
      "Please upload 3-5 real (redacted if needed) broker submission packages so we can study the actual formats.",
    context:
      "Real submissions are the single best input for calibrating the extraction pipeline. We need examples of the actual documents brokers send — including broker presentation documents, MRC slips, schedules of interest, claims bordereaux, and any cover letters. Sensitive data can be redacted.",
    inputType: "file_upload",
    required: true,
    order: 4,
  },

  // =====================================================
  // CATEGORY 5: RATING METHODOLOGY  (RAT-001 → RAT-008)
  // =====================================================
  {
    id: "RAT-001",
    categorySlug: "rating-methodology",
    title: "Rating Workbook",
    question:
      "Upload the Excel rating workbook(s) used to calculate premiums.",
    context:
      "The system needs to execute the same rating logic actuaries have built into Excel. We'll integrate the workbook directly — the system reads inputs into the correct cells, recalculates, and reads outputs. The formulas are never modified. Upload the current version for each line of business.",
    inputType: "file_upload",
    required: true,
    order: 1,
  },
  {
    id: "RAT-002",
    categorySlug: "rating-methodology",
    title: "Base Rates by Class",
    question:
      "What are the base rates by classification, territory, and limit tier?",
    context:
      "If rating is done outside the workbook or if we need to validate workbook outputs, we need the rate manual. This includes base rates per class code, territory factors, and how limits affect pricing. If this is all embedded in the workbook, just note that.",
    inputType: "free_text",
    placeholder:
      "e.g., All base rates are embedded in the Excel workbook (tab 'Rate Tables'). Rates are keyed by UK SIC code, territory (UK/Ireland/EEA), and limit tier...\n\nOR provide a rate table here.",
    required: true,
    order: 2,
  },
  {
    id: "RAT-003",
    categorySlug: "rating-methodology",
    title: "Exposure Multipliers",
    question:
      "What are the loading factors for payroll, turnover, employee count, and other exposure bases?",
    context:
      "Premiums are typically calculated as base rate multiplied by an exposure measure (turnover for Public Liability, payroll/headcount for Employers' Liability). We need to understand which exposure base applies to each line and any multipliers or factors applied.",
    inputType: "data_table",
    tableColumns: [
      { key: "line", label: "Line of Business", type: "text", required: true },
      { key: "exposureBase", label: "Exposure Base", type: "text", required: true },
      { key: "rate", label: "Rate per £1,000 / €1,000", type: "number" },
      { key: "notes", label: "Notes", type: "text" },
    ],
    required: true,
    order: 3,
  },
  {
    id: "RAT-004",
    categorySlug: "rating-methodology",
    title: "Excess Tier Boundaries",
    question:
      "How do excess options map to premium levels or risk characteristics?",
    context:
      "The current prototype computes excess levels based on premium tiers (e.g., premium > £100K → £50K excess option). We need to confirm or replace this logic with your actual excess determination method.",
    inputType: "data_table",
    tableColumns: [
      { key: "line", label: "Line", type: "text", required: true },
      { key: "excess", label: "Excess Amount", type: "text", required: true },
      { key: "condition", label: "When This Applies", type: "text", required: true },
      { key: "premiumImpact", label: "Premium Credit/Charge", type: "text" },
    ],
    required: true,
    order: 4,
  },
  {
    id: "RAT-005",
    categorySlug: "rating-methodology",
    title: "Credit & Debit Modifications",
    question:
      "What schedule modification or experience modification factors are applied?",
    context:
      "Beyond base rates, premiums are often adjusted by: schedule credits/debits (underwriter judgement, typically +/- 25%), experience rating (based on 3-5 year claims history at the MGA/insurer's discretion), and package credits (multi-line discount). We need to know which apply and their ranges.",
    inputType: "free_text",
    placeholder:
      "e.g., Schedule mod: +/- 25% at UW discretion. Experience rating: based on 3-5 year claims experience at underwriter's assessment. Package credit: 5% for 2+ lines. Loss-free credit: 10% for 5 years clean...",
    required: true,
    order: 5,
  },
  {
    id: "RAT-006",
    categorySlug: "rating-methodology",
    title: "Multi-Line Premium Calculation",
    question:
      "When an insured has multiple lines, how are premiums combined? Simple addition, blended rate, or package discount?",
    context:
      "Multi-line accounts may have special pricing. We need to know if each line is priced independently and then summed, or if there's a package-level calculation that considers the combination of covers.",
    inputType: "free_text",
    placeholder:
      "e.g., Each line rated independently. Sum all line premiums. Apply 5% package discount if 2+ lines. Minimum combined premium: £5,000 / €5,500...",
    required: true,
    order: 6,
  },
  {
    id: "RAT-007",
    categorySlug: "rating-methodology",
    title: "Workbook Versioning",
    question:
      "How often is the rating workbook updated? Do we need to track which version was used for each quote?",
    context:
      "For audit purposes, we may need to record exactly which workbook version produced each premium. This means hashing the file and storing it in the audit pack. If the workbook changes frequently, version tracking is critical.",
    inputType: "free_text",
    placeholder:
      "e.g., Workbook updated quarterly. Each version stamped with effective date. Yes, we must track which version was used for each quote for regulatory compliance...",
    required: true,
    order: 7,
  },
  {
    id: "RAT-008",
    categorySlug: "rating-methodology",
    title: "Rating Inputs & Outputs",
    question:
      "What are the exact input fields the rating workbook needs, and what outputs does it produce?",
    context:
      "We need a precise cell-level mapping: which extracted fields go into which workbook cells, and which cells contain the output premium, limits, excess, etc. This can be a simple list or a reference to the workbook tabs.",
    inputType: "data_table",
    tableColumns: [
      {
        key: "direction",
        label: "Input/Output",
        type: "select",
        options: [
          { value: "input", label: "Input" },
          { value: "output", label: "Output" },
        ],
        required: true,
      },
      { key: "field", label: "Field Name", type: "text", required: true },
      { key: "cellRef", label: "Cell Reference (if known)", type: "text" },
      { key: "format", label: "Format / Notes", type: "text" },
    ],
    required: true,
    order: 8,
  },

  // =====================================================
  // CATEGORY 6: WORKFLOW & SOPs  (WFL-001 → WFL-010)
  // =====================================================
  {
    id: "WFL-001",
    categorySlug: "workflow-sops",
    title: "Referral Escalation Path",
    question:
      "When a submission is referred, who reviews it? What are the authority levels and approval chain?",
    context:
      "The referral workflow is critical to operational efficiency. We need to know: Who is the first reviewer? What decisions can they make (approve, decline, request more data)? Is there a second-level escalation? What premium or limit thresholds change the authority level?",
    inputType: "free_text",
    placeholder:
      "e.g., Level 1: Senior Underwriter — can approve submissions up to £500K / €550K premium.\nLevel 2: Underwriting Manager — required for premiums over £500K / €550K or 3+ referral flags.\nLevel 3: CUO — required for any submission with adverse news findings.",
    required: true,
    order: 1,
  },
  {
    id: "WFL-002",
    categorySlug: "workflow-sops",
    title: "Data-Request Memo Content",
    question:
      "What should a data-request memo to the broker contain? How specific should it be?",
    context:
      "When the system identifies missing information, it can generate a targeted memo to the broker. This is much better than a generic 'please provide more information.' We need to know the format, tone, and level of detail — should it explain WHY each field is needed?",
    inputType: "free_text",
    placeholder:
      "e.g., List each missing item with:\n1. What's needed (e.g., '5-year claims history from prior insurer')\n2. Why it's needed (e.g., 'Required for loss ratio calculation per our underwriting guidelines')\n3. Acceptable formats\n4. Response deadline\n\nTone: Professional but direct. Reference the specific submission by insured name and date.",
    required: true,
    order: 2,
  },
  {
    id: "WFL-003",
    categorySlug: "workflow-sops",
    title: "Broker Response SLA",
    question:
      "How many business days does a broker have to respond to a data request before the submission expires?",
    context:
      "Open data requests consume underwriter attention. Setting a clear SLA (e.g., 10 business days) allows the system to auto-close stale requests and notify the broker. Expired submissions can be resubmitted later.",
    inputType: "numeric",
    numericValidation: { min: 1, max: 90, step: 1, suffix: "business days" },
    placeholder: "10",
    required: true,
    order: 3,
  },
  {
    id: "WFL-004",
    categorySlug: "workflow-sops",
    title: "Resubmission Handling",
    question:
      "When a broker resubmits after a data request, should the system re-run the full pipeline or only process the new/changed information?",
    context:
      "Re-running the full pipeline is simpler but slower. Incremental processing is faster but more complex to implement. The choice depends on how often resubmissions occur and whether previously extracted data should be re-verified.",
    inputType: "single_select",
    options: [
      {
        value: "full_rerun",
        label: "Re-run entire pipeline",
        description: "Start fresh with the updated submission — simplest, most thorough",
      },
      {
        value: "incremental",
        label: "Process only changes",
        description: "Keep previously extracted data, only re-extract missing/updated fields",
      },
      {
        value: "merge",
        label: "Merge new data with existing",
        description: "Combine original extraction with new submission, flag conflicts",
      },
    ],
    required: true,
    order: 4,
  },
  {
    id: "WFL-005",
    categorySlug: "workflow-sops",
    title: "Decline Override Process",
    question:
      "Can a senior underwriter override an auto-decline? If so, under what circumstances and with what documentation?",
    context:
      "Some auto-declines may have exceptions. For example, a slightly-over-threshold turnover might be acceptable for a long-standing account. We need to know if overrides are possible, who can authorise them, and what documentation is required.",
    inputType: "free_text",
    placeholder:
      "e.g., Referral-level declines can be overridden by the Underwriting Manager with written justification.\nHard declines (blocked industry code (UK SIC), OFSI/EU consolidated list sanctions matches) cannot be overridden.\nAll overrides are logged in the audit pack with the authoriser's name and rationale.",
    required: true,
    order: 5,
  },
  {
    id: "WFL-006",
    categorySlug: "workflow-sops",
    title: "Decline Communication Template",
    question:
      "What standard language should be used in decline letters? Provide a template or describe the requirements.",
    context:
      "Decline letters must comply with FCA Treating Customers Fairly (TCF) requirements and CBI Consumer Protection Code where applicable. They should be professional, specific enough that the broker understands why, but not so detailed as to create legal exposure. Lloyd's market protocols may apply for coverholder business.",
    inputType: "free_text",
    placeholder:
      "e.g., Template should include:\n- Insured name and submission reference\n- Specific reason for decline (not generic)\n- Reference to the relevant underwriting guideline\n- Any options for resubmission\n- Required FCA/CBI regulatory notices\n- Lloyd's market wording where applicable",
    required: true,
    order: 6,
  },
  {
    id: "WFL-007",
    categorySlug: "workflow-sops",
    title: "Appeal Process",
    question:
      "Can an applicant or broker appeal a decline? If so, what is the process?",
    context:
      "An appeal process provides a path for borderline cases. We need to know if appeals are accepted, who reviews them, what additional information can be submitted, and the timeline.",
    inputType: "free_text",
    placeholder:
      "e.g., Brokers may appeal within 30 days with additional documentation. Appeals reviewed by UW Manager within 5 business days. Decision is final...",
    required: false,
    order: 7,
  },
  {
    id: "WFL-008",
    categorySlug: "workflow-sops",
    title: "Quote Validity Period",
    question: "How many days is a quote valid after issuance?",
    context:
      "Quotes expire to manage rate adequacy and changing risk conditions. The validity period affects when follow-up reminders are sent to brokers and when quotes are automatically archived.",
    inputType: "numeric",
    numericValidation: { min: 7, max: 180, step: 1, suffix: "days" },
    placeholder: "30",
    required: true,
    order: 8,
  },
  {
    id: "WFL-009",
    categorySlug: "workflow-sops",
    title: "Quote Package Contents",
    question:
      "What documents and information should be included in the quote package sent to the broker?",
    context:
      "The quote package is what the broker sees. Beyond the premium/excess/limit, it may include: cover summary, key exclusions, conditions, subjectivities (standard London market practice), payment terms, required forms, binding instructions, and binding authority reference / coverholder stamp. We need the complete list.",
    inputType: "free_text",
    placeholder:
      "e.g., Quote package includes:\n1. Quote letter with 3 options (recommended, conservative, broader)\n2. Premium breakdown by line\n3. Cover summary (included/excluded)\n4. Excess schedule\n5. Key conditions, warranties, and subjectivities\n6. Binding instructions and deadlines\n7. Required signed applications\n8. Binding authority / coverholder reference",
    required: true,
    order: 9,
  },
  {
    id: "WFL-010",
    categorySlug: "workflow-sops",
    title: "Delegated Authority Type",
    question:
      "What type of delegated authority arrangement does this MGA operate under?",
    context:
      "The delegated authority model determines reporting requirements, audit standards, and operational constraints. A Lloyd's coverholder operates under a binding authority agreement (binder) with specific terms of authority. Company market delegated authority may have different structures. Understanding the model is fundamental to system design.",
    inputType: "single_select",
    options: [
      { value: "lloyds_coverholder", label: "Lloyd's Coverholder (binding authority agreement)" },
      { value: "company_market_da", label: "Company Market Delegated Authority" },
      { value: "both", label: "Both Lloyd's and Company Market" },
      { value: "mga_own_capacity", label: "MGA with own capacity (not delegated)" },
    ],
    required: true,
    order: 10,
  },

  // =====================================================
  // CATEGORY 7: ADVERSE NEWS CRITERIA  (ADV-001 → ADV-007)
  // =====================================================
  {
    id: "ADV-001",
    categorySlug: "adverse-news-criteria",
    title: "Adverse News Categories",
    question:
      "What types of negative findings about an applicant are relevant to underwriting? Select all that apply.",
    context:
      "Adverse news screening is a key risk assessment tool. Different finding types have different severity. We need to know which categories to search for and how each affects the underwriting decision.",
    inputType: "multi_select",
    options: [
      { value: "hse", label: "HSE enforcement actions / workplace safety issues" },
      { value: "criminal", label: "Criminal charges or convictions" },
      { value: "bankruptcy", label: "Insolvency / bankruptcy filings" },
      { value: "environmental", label: "Environmental violations / contamination" },
      { value: "sanctions", label: "Government sanctions (OFSI UK Sanctions List, EU consolidated list)" },
      { value: "lawsuits", label: "Significant lawsuits / litigation" },
      { value: "regulatory", label: "Regulatory actions / fines (FCA, CBI, etc.)" },
      { value: "fraud", label: "Insurance fraud allegations" },
      { value: "reputational", label: "Major reputational events" },
    ],
    required: true,
    order: 1,
  },
  {
    id: "ADV-002",
    categorySlug: "adverse-news-criteria",
    title: "Source Quality Tiers",
    question:
      "How should we rank the reliability of different news sources?",
    context:
      "Not all sources are equally trustworthy. A Reuters article is more reliable than a blog post. The system uses source quality to weight findings and determine citability — Tier 1 sources can be cited in decline letters; Tier 4 sources only trigger additional research.",
    inputType: "data_table",
    tableColumns: [
      {
        key: "tier",
        label: "Tier",
        type: "select",
        options: [
          { value: "1", label: "Tier 1 (Highest — citable in declinations)" },
          { value: "2", label: "Tier 2 (Strong supporting evidence)" },
          { value: "3", label: "Tier 3 (Requires corroboration)" },
          { value: "4", label: "Tier 4 (Triggers research only, never citable)" },
        ],
        required: true,
      },
      { key: "sources", label: "Sources in This Tier", type: "text", required: true },
    ],
    placeholder: "e.g., Tier 1: Reuters, AP, Bloomberg, FT, Companies House filings, FCA enforcement notices, SFO press releases, CBI enforcement actions",
    required: true,
    order: 2,
  },
  {
    id: "ADV-003",
    categorySlug: "adverse-news-criteria",
    title: "Entity Screening Scope",
    question:
      "Which entities should be screened for adverse news? Select all that apply.",
    context:
      "Adverse news can exist at the company level, under trade names, or associated with individual directors. Broader screening catches more risks but takes longer and may produce more false positives.",
    inputType: "multi_select",
    options: [
      { value: "named_insured", label: "Named Insured (legal company name)" },
      { value: "trading_name", label: "Trading name (t/a)" },
      { value: "principals", label: "Directors and officers (by name)" },
      { value: "locations", label: "Location addresses (environmental concerns)" },
      { value: "company_reg", label: "Company Registration Number / VAT ID (Companies House, CRO Ireland)" },
    ],
    required: true,
    order: 3,
  },
  {
    id: "ADV-004",
    categorySlug: "adverse-news-criteria",
    title: "Citation Requirements",
    question:
      "Must adverse news findings be verified (URL exists, content matches) before they can be cited in a decline or referral?",
    context:
      "AI-generated citations can sometimes be fabricated. A verification pipeline checks that the cited URL exists, the content matches the claim, and the publication date is within the claimed timeframe. This is critical for regulatory compliance and avoiding the 'hallucinated citation' problem.",
    inputType: "free_text",
    placeholder:
      "e.g., All citations must pass verification before appearing in any external communication. Internal referral memos can include unverified findings if clearly marked as 'unverified.' Decline letters must only cite Tier 1-2 verified sources...",
    required: true,
    order: 4,
  },
  {
    id: "ADV-005",
    categorySlug: "adverse-news-criteria",
    title: "Finding-to-Action Mapping",
    question:
      "For each type of adverse finding, what action should the system take?",
    context:
      "Different findings warrant different responses. A sanctions match might be an auto-decline, while a minor HSE enforcement notice might just be noted. We need explicit mapping from finding type and severity to underwriting action.",
    inputType: "data_table",
    tableColumns: [
      { key: "findingType", label: "Finding Type", type: "text", required: true },
      {
        key: "severity",
        label: "Severity",
        type: "select",
        options: [
          { value: "critical", label: "Critical" },
          { value: "high", label: "High" },
          { value: "medium", label: "Medium" },
          { value: "low", label: "Low" },
        ],
        required: true,
      },
      {
        key: "action",
        label: "Action",
        type: "select",
        options: [
          { value: "decline", label: "Auto-Decline" },
          { value: "refer", label: "Refer to Senior UW" },
          { value: "note", label: "Note in File (No Action)" },
          { value: "investigate", label: "Additional Investigation" },
        ],
        required: true,
      },
    ],
    required: true,
    order: 5,
  },
  {
    id: "ADV-006",
    categorySlug: "adverse-news-criteria",
    title: "Relevance Window",
    question:
      "How far back in time should adverse news searches look? When does a finding become too old to be relevant?",
    context:
      "An insolvency from 15 years ago may no longer be relevant, but an HSE enforcement action from last year certainly is. We need a default lookback period and any category-specific variations.",
    inputType: "numeric",
    numericValidation: { min: 1, max: 20, step: 1, suffix: "years" },
    placeholder: "5",
    required: true,
    order: 6,
  },
  {
    id: "ADV-007",
    categorySlug: "adverse-news-criteria",
    title: "Principal Screening",
    question:
      "If a company director (not the company itself) has adverse history, does that trigger an underwriting action?",
    context:
      "A company may be clean, but its director may have been involved in fraud at a previous company. We need to know if director-level findings affect the underwriting decision and how they differ from company-level findings.",
    inputType: "free_text",
    placeholder:
      "e.g., Screen all directors and persons of significant control (>25% significant control per Companies House PSC register). Treat principal findings as: Critical = same as company findings. Medium/Low = note in file and include in referral memo but don't auto-decline...",
    required: true,
    order: 7,
  },

  // =====================================================
  // CATEGORY 8: COMPLIANCE & AUDIT  (CMP-001 → CMP-010)
  // =====================================================
  {
    id: "CMP-001",
    categorySlug: "compliance-audit",
    title: "EU AI Act & FCA AI/ML Compliance",
    question:
      "Are we subject to the EU AI Act and/or FCA AI/ML guidance for the use of AI in underwriting? Which jurisdictions are we operating in?",
    context:
      "The EU AI Act (phased implementation 2024-2026) classifies insurance underwriting AI as high-risk (Annex III), requiring conformity assessments, transparency obligations, human oversight, and risk management systems. The FCA has published guidance on AI/ML in financial services (FS2/23) and the PRA has set expectations for model risk management (SS1/23). Lloyd's has its own expectations for AI use in delegated authority arrangements. If operating across UK and EEA, dual compliance may be required.",
    inputType: "free_text",
    placeholder:
      "e.g., We operate as a coverholder in the UK (FCA-authorised) and Ireland (CBI-authorised), with EEA passporting. We need compliance with: EU AI Act high-risk requirements, FCA AI/ML guidance (FS2/23), PRA model risk expectations (SS1/23), and Lloyd's delegated authority AI standards...",
    required: true,
    order: 1,
  },
  {
    id: "CMP-002",
    categorySlug: "compliance-audit",
    title: "AI Governance Policy",
    question:
      "Do we have (or need) a formal written policy on the use of AI in underwriting?",
    context:
      "EU AI Act requirements (Article 9 risk management, Article 13 transparency, Article 14 human oversight), FCA expectations (FS2/23), and PRA model risk management (SS1/23) all require formal governance covering: the role AI plays in decisions, how fairness is ensured, how decisions are explained, bias testing procedures, and affected person notification. We need to know if this exists or needs to be created.",
    inputType: "free_text",
    placeholder:
      "e.g., No formal AI policy exists yet. We need to create one covering: scope of AI use, human oversight requirements, bias testing schedule, transparency and explainability measures, and annual review process...",
    required: true,
    order: 2,
  },
  {
    id: "CMP-003",
    categorySlug: "compliance-audit",
    title: "Record Retention Period",
    question:
      "How many years must we retain all underwriting decision records and supporting documents?",
    context:
      "GDPR requires retention only as long as necessary for the stated purpose, with a documented retention policy. FCA SYSC record-keeping rules require retention of records sufficient to demonstrate compliance. Lloyd's coverholder agreements typically require 7-year retention from policy expiry. Solvency II delegated acts may impose additional requirements. We need to balance these overlapping obligations.",
    inputType: "numeric",
    numericValidation: { min: 3, max: 15, step: 1, suffix: "years" },
    placeholder: "7",
    required: true,
    order: 3,
  },
  {
    id: "CMP-004",
    categorySlug: "compliance-audit",
    title: "Provenance Detail Level",
    question:
      "How much detail should we capture about where each extracted data point came from?",
    context:
      "Provenance traces every extracted field back to its source in the original document. More detail means better auditability but higher processing cost. Page number is basic; bounding box + exact text snippet is the gold standard.",
    inputType: "single_select",
    options: [
      { value: "page", label: "Page number only" },
      { value: "page_section", label: "Page number + section heading" },
      { value: "full", label: "Page + bounding box coordinates + exact source text" },
    ],
    required: true,
    order: 4,
  },
  {
    id: "CMP-005",
    categorySlug: "compliance-audit",
    title: "Decision Trace Immutability",
    question:
      "Must every rule evaluation be timestamped and tamper-proof (cryptographically sealed)?",
    context:
      "Immutable decision traces mean that once a rule evaluation is recorded, it cannot be altered. This is achieved with SHA-256 hashing and digital signatures. It provides the strongest audit evidence but adds processing overhead.",
    inputType: "yes_no",
    required: true,
    order: 5,
  },
  {
    id: "CMP-006",
    categorySlug: "compliance-audit",
    title: "Decision Replayability",
    question:
      "Must we be able to exactly reproduce any past underwriting decision from its audit pack alone?",
    context:
      "Replayability means the audit pack contains everything needed to re-derive the same decision: original documents, extracted data, rule definitions, rating workbook version, and adverse news findings. This is the strongest compliance guarantee but requires storing more data.",
    inputType: "free_text",
    placeholder:
      "e.g., Yes, full replayability required. Audit pack must contain: original submission documents, extracted fields with provenance, rule definitions as of decision date, rating workbook copy, adverse news results with cached source content...",
    required: true,
    order: 6,
  },
  {
    id: "CMP-007",
    categorySlug: "compliance-audit",
    title: "Audit Pack Encryption",
    question:
      "Must audit packs be encrypted at rest? If so, what encryption standard and key management approach?",
    context:
      "Audit packs contain sensitive business and personal information. GDPR Article 32 requires appropriate technical measures including encryption where appropriate. Encryption (e.g., AES-256) protects them if storage is compromised. Key management adds operational complexity. Need to balance security requirements with accessibility for auditors.",
    inputType: "free_text",
    placeholder:
      "e.g., Yes, AES-256 encryption required per GDPR Article 32 obligations. Keys managed through [key management approach]. Auditors receive time-limited decryption keys upon authorised request...\n\nOR: No encryption required at this stage — access control is sufficient.",
    required: true,
    order: 7,
  },
  {
    id: "CMP-008",
    categorySlug: "compliance-audit",
    title: "Regulatory Reporting Requirements",
    question:
      "What regulatory reporting obligations apply to our underwriting activities across UK, Ireland, and EEA?",
    context:
      "Depending on jurisdictions and delegated authority type, various reporting obligations apply. The FCA requires regulatory returns for authorised firms. The CBI requires notifications for Irish-authorised activities. Lloyd's coverholders must submit performance management data (PMD) and quarterly bordereaux via DA SATS. Solvency II reporting under delegated acts may also apply.",
    inputType: "free_text",
    placeholder:
      "e.g., FCA regulatory returns (annual). CBI notifications for Irish-authorised activities. Lloyd's performance management data (PMD) and quarterly bordereaux. DA SATS / DDM reporting for Lloyd's coverholder business. Solvency II reporting under delegated acts where applicable...",
    required: false,
    order: 8,
  },
  {
    id: "CMP-009",
    categorySlug: "compliance-audit",
    title: "GDPR Data Processing Basis",
    question:
      "What is the lawful basis for processing personal data in underwriting submissions under GDPR?",
    context:
      "GDPR requires a lawful basis for processing personal data. For insurance underwriting, common bases include: legitimate interests (Article 6(1)(f)), performance of a contract (Article 6(1)(b)), or legal obligation (Article 6(1)(c)). Special category data (e.g., health data for employers' liability claims) requires an additional condition under Article 9. The ICO (UK) and DPC (Ireland) may have specific guidance for the insurance sector.",
    inputType: "free_text",
    placeholder:
      "e.g., Legitimate interests (Article 6(1)(f)) for standard commercial underwriting data. For any health-related data (EL claims history), we rely on substantial public interest (Article 9(2)(g)) with appropriate safeguards per Schedule 1, Part 2 of the UK Data Protection Act 2018...",
    required: true,
    order: 9,
  },
  {
    id: "CMP-010",
    categorySlug: "compliance-audit",
    title: "Sanctions List Selection",
    question:
      "Which sanctions lists must be checked during screening? Select all that apply.",
    context:
      "Post-Brexit, the UK maintains its own sanctions regime (OFSI — Office of Financial Sanctions Implementation) separate from the EU consolidated list. For business written in Ireland or the EEA, the EU consolidated sanctions list applies. Lloyd's requires compliance with both UK and applicable international sanctions. Dual-screening may be required for cross-border operations. OFAC screening may also be needed if any US-connected business is written.",
    inputType: "multi_select",
    options: [
      { value: "ofsi", label: "OFSI UK Sanctions List (mandatory for UK business)" },
      { value: "eu_consolidated", label: "EU Consolidated Sanctions List (mandatory for EEA business)" },
      { value: "un", label: "UN Security Council Consolidated List" },
      { value: "ofac", label: "OFAC SDN List (if US-connected business)" },
      { value: "hmt", label: "HMT Financial Sanctions Targets (UK)" },
    ],
    required: true,
    order: 10,
  },

  // =====================================================
  // CATEGORY 9: QUOTE PACKAGING  (QPK-001 → QPK-008)
  // =====================================================
  {
    id: "QPK-001",
    categorySlug: "quote-packaging",
    title: "Quote Option Naming",
    question:
      "How should the three quote options be labelled? (e.g., Recommended / Conservative / Broader)",
    context:
      "The system generates three quote options with different premium, excess, and cover levels. The naming affects how brokers perceive the options. 'Recommended' implies our preference; 'Option A/B/C' is neutral; descriptive names like 'Standard / Enhanced / Premium' convey value.",
    inputType: "free_text",
    placeholder:
      "e.g., Option A: 'Recommended' (best risk-adjusted value)\nOption B: 'Conservative' (higher excess, lower premium)\nOption C: 'Broader' (lower excess, higher premium, enhanced limits)",
    required: true,
    order: 1,
  },
  {
    id: "QPK-002",
    categorySlug: "quote-packaging",
    title: "Recommendation Logic",
    question:
      "What determines which of the three quote options is labelled as 'recommended'?",
    context:
      "The recommendation signals our preferred option. It could be based on: the best risk-adjusted value, the option closest to the broker's requested terms, the most competitively priced, or always the middle option. We need a clear rule.",
    inputType: "free_text",
    placeholder:
      "e.g., Recommend the option that:\n1. Matches the broker's requested limits/excess most closely\n2. Falls within standard terms (no modifications needed)\n3. If no broker preference stated, recommend the middle option (Option A)\n\nNever recommend the broadest cover if loss history is adverse.",
    required: true,
    order: 2,
  },
  {
    id: "QPK-003",
    categorySlug: "quote-packaging",
    title: "Quote Letter Contents",
    question:
      "What information must be included in the quote letter sent to the broker? Select all that apply.",
    context:
      "The quote letter is the formal offer. Different items serve different purposes — premium satisfies the broker's pricing needs; conditions protect our interests; cover summary helps the broker sell to their client.",
    inputType: "multi_select",
    options: [
      { value: "premium", label: "Premium breakdown by line" },
      { value: "limits", label: "Limits and excess per line" },
      { value: "cover", label: "Cover summary (inclusions)" },
      { value: "exclusions", label: "Key exclusions" },
      { value: "conditions", label: "Conditions and warranties" },
      { value: "subjectivities", label: "Subjectivities (items needed before binding)" },
      { value: "payment", label: "Payment terms and instalment options" },
      { value: "binding", label: "Binding instructions and deadline" },
      { value: "renewal", label: "Renewal terms" },
      { value: "extensions", label: "Policy extensions / endorsements" },
    ],
    required: true,
    order: 3,
  },
  {
    id: "QPK-004",
    categorySlug: "quote-packaging",
    title: "Quote Validity Window",
    question: "How many calendar days is a quote valid after issuance?",
    context:
      "A shorter validity window (e.g., 30 days) ensures rates stay current but may pressure brokers. A longer window (60-90 days) is broker-friendly but exposes us to rate adequacy risk. Industry standard is typically 30-60 days.",
    inputType: "numeric",
    numericValidation: { min: 7, max: 180, step: 1, suffix: "calendar days" },
    placeholder: "30",
    required: true,
    order: 4,
  },
  {
    id: "QPK-005",
    categorySlug: "quote-packaging",
    title: "Limit/Excess Variation Across Options",
    question:
      "How should limits and excess levels vary across the three quote options?",
    context:
      "The three options should offer meaningfully different cost/cover trade-offs. We need to define how limits and excess vary — for example, Option B might have 2x the excess of Option A but 10% lower premium.",
    inputType: "data_table",
    tableColumns: [
      { key: "option", label: "Option", type: "text", required: true },
      { key: "limits", label: "Limits", type: "text", required: true },
      { key: "excess", label: "Excess", type: "text", required: true },
      { key: "premiumAdjustment", label: "Premium vs. Base", type: "text", required: true },
      { key: "description", label: "Description", type: "text" },
    ],
    required: true,
    order: 5,
  },
  {
    id: "QPK-006",
    categorySlug: "quote-packaging",
    title: "Standard Terms & Conditions",
    question:
      "Upload or describe the standard terms and conditions language included with every quote.",
    context:
      "Standard T&C language covers: policy wording, territorial scope, cancellation terms, premium adjustment provisions, risk management requirements, etc. This language is usually reviewed by legal and should be consistent across all quotes.",
    inputType: "file_upload",
    required: true,
    order: 6,
  },
  {
    id: "QPK-007",
    categorySlug: "quote-packaging",
    title: "Broker Guidance Notes",
    question:
      "Should the quote package include guidance explaining the differences between options and why we recommend a specific one?",
    context:
      "Guidance notes help the broker understand our reasoning and sell the recommended option to their client. However, some MGAs prefer to let the numbers speak for themselves and handle explanations via phone/email.",
    inputType: "free_text",
    placeholder:
      "e.g., Yes, include a brief narrative explaining:\n- Why Option A is recommended (e.g., 'Based on the applicant's clean claims history and mid-range turnover, this option offers the best value')\n- Key differences between options\n- Any risk factors the broker should discuss with the insured",
    required: false,
    order: 7,
  },
  {
    id: "QPK-008",
    categorySlug: "quote-packaging",
    title: "Recommendation Rationale",
    question:
      "What justification should accompany the recommended quote option?",
    context:
      "The rationale explains our recommendation in business terms. It can reference the applicant's risk profile, industry benchmarks, loss history, and how the recommended terms align with their needs. This builds broker confidence in our underwriting.",
    inputType: "free_text",
    placeholder:
      "e.g., Rationale should reference:\n1. The applicant's loss history (favourable/unfavourable)\n2. Industry comparison (how their risk compares to class average)\n3. Specific cover features that match their exposure profile\n4. Any modifications or credits applied and why",
    required: false,
    order: 8,
  },

  // =====================================================
  // CATEGORY 10: MEASURES & SUCCESS CRITERIA  (MSC-001 → MSC-009)
  // =====================================================
  {
    id: "MSC-001",
    categorySlug: "measures-success-criteria",
    title: "Field Extraction Accuracy",
    question:
      "What accuracy target should we achieve for extracting key fields from submissions? (Industry benchmark: 90%+)",
    context:
      "Field extraction accuracy is measured by comparing the system's output against manually verified 'ground truth.' The target applies to core fields like insured name, turnover, payroll, limits, and UK SIC code. Higher accuracy reduces manual review but requires more sophisticated extraction.",
    inputType: "numeric",
    numericValidation: { min: 70, max: 100, step: 1, suffix: "%" },
    placeholder: "90",
    required: true,
    order: 1,
  },
  {
    id: "MSC-002",
    categorySlug: "measures-success-criteria",
    title: "Triage Accuracy",
    question:
      "What percentage of submissions should the system correctly triage (pass/refer/decline)?",
    context:
      "Triage accuracy measures whether the system makes the same pass/refer/decline decision a human underwriter would. False positives (unnecessary referrals) waste time; false negatives (missed risks getting through) are dangerous.",
    inputType: "numeric",
    numericValidation: { min: 70, max: 100, step: 1, suffix: "%" },
    placeholder: "95",
    required: true,
    order: 2,
  },
  {
    id: "MSC-003",
    categorySlug: "measures-success-criteria",
    title: "Processing Time Target",
    question:
      "What is the maximum acceptable time to process a single submission from upload to quote?",
    context:
      "Processing time affects the broker experience. The current spec targets under 60 seconds for the full pipeline (extraction, triage, adverse news, rating, quote generation). Real-time streaming shows progress during processing.",
    inputType: "numeric",
    numericValidation: { min: 5, max: 600, step: 5, suffix: "seconds" },
    placeholder: "60",
    required: true,
    order: 3,
  },
  {
    id: "MSC-004",
    categorySlug: "measures-success-criteria",
    title: "False Positive/Negative Tolerance",
    question:
      "What is the acceptable rate of false referrals vs. missed risks?",
    context:
      "There's always a trade-off: a system that refers too aggressively wastes underwriter time but catches all risks. A permissive system is efficient but may miss problems. We need to know which error type is more costly and the acceptable rates.",
    inputType: "free_text",
    placeholder:
      "e.g., False referrals (unnecessary escalation): acceptable up to 15% — better to over-refer than miss a risk.\nFalse passes (missed risk): must be below 2% — this is the more dangerous error.\nFalse declines: must be below 1% — we should never decline good business.",
    required: true,
    order: 4,
  },
  {
    id: "MSC-005",
    categorySlug: "measures-success-criteria",
    title: "Audit Compliance Verification",
    question:
      "How should we verify that the system meets audit and compliance requirements?",
    context:
      "Verification approaches range from manual spot-checks to automated test suites that validate every audit pack. We need to know the expected verification rigour and frequency — is this annual, quarterly, or continuous?",
    inputType: "free_text",
    placeholder:
      "e.g., Quarterly audit of 10 randomly selected audit packs by compliance team. Annual audit for FCA/CBI regulatory compliance. Lloyd's coverholder audit requirements. EU AI Act conformity assessment where applicable. Automated integrity checks (SHA-256 verification) on every pack at creation time...",
    required: true,
    order: 5,
  },
  {
    id: "MSC-006",
    categorySlug: "measures-success-criteria",
    title: "Go-Live Readiness Criteria",
    question:
      "What must be true before the system can be used on real submissions?",
    context:
      "Go-live readiness typically includes: accuracy targets met on test data, regulatory approvals obtained, user training complete, fallback procedures documented, and monitoring in place. Define the specific criteria for this system.",
    inputType: "free_text",
    placeholder:
      "e.g., Go-live requires:\n1. 90%+ extraction accuracy on 50+ test documents\n2. 95%+ triage accuracy validated by senior UW review\n3. Successful audit pack verification by compliance\n4. UW team trained on override and referral workflows\n5. Fallback procedure documented (manual processing if system fails)\n6. 2-week parallel-run with both system and manual processing",
    required: true,
    order: 6,
  },
  {
    id: "MSC-007",
    categorySlug: "measures-success-criteria",
    title: "Insurance Premium Tax (IPT) Configuration",
    question:
      "How should Insurance Premium Tax be calculated and displayed across territories?",
    context:
      "IPT rates vary by territory and line of business. UK standard IPT is 12%, with a higher rate of 20% for certain lines (including travel insurance). Ireland has a non-life insurance levy of 3% plus a fixed stamp duty of €1 per policy (the Insurance Compensation Fund levy was reduced from 2% to 1% as of 1 January 2026). Different EEA member states have different IPT rates. The system needs to apply the correct rate based on the risk location, not the policyholder location. IPT must be shown separately on the quote.",
    inputType: "data_table",
    tableColumns: [
      { key: "territory", label: "Territory", type: "text", required: true },
      { key: "standardRate", label: "Standard IPT Rate (%)", type: "number", required: true },
      { key: "higherRate", label: "Higher Rate (%)", type: "number" },
      { key: "applicableLines", label: "Lines at Higher Rate", type: "text" },
      { key: "notes", label: "Notes", type: "text" },
    ],
    required: true,
    order: 7,
  },
  {
    id: "MSC-008",
    categorySlug: "measures-success-criteria",
    title: "DA SATS / DDM Reporting Requirements",
    question:
      "What delegated authority reporting standards must the system support?",
    context:
      "Lloyd's coverholders must submit Delegated Authority Supplementary Accounting and Tax Schedules (DA SATS) and may need to use the Delegated Data Manager (DDM) for bordereaux in prescribed formats. Company market delegated authorities may have their own reporting requirements. The system must capture and export data in the required formats. DA SATS data includes premium, claims, and tax information at individual risk level. Note: Lloyd's Europe continues to require DDM for business written with Lloyd's Insurance Company (LIC).",
    inputType: "free_text",
    placeholder:
      "e.g., Lloyd's DA SATS monthly bordereaux submission required. DDM risk-level data capture from inception. Lloyd's Europe business requires DDM specifically. Company market insurer requires quarterly premium bordereaux and monthly claims bordereaux in their template...",
    required: true,
    order: 8,
  },
  {
    id: "MSC-009",
    categorySlug: "measures-success-criteria",
    title: "Cross-Border Passporting Model",
    question:
      "How does the MGA handle cross-border business across UK, Ireland, and EEA jurisdictions?",
    context:
      "Post-Brexit, UK-authorised firms cannot passport into the EEA. Irish-authorised firms (registered with the CBI) can passport across the EEA via freedom of establishment or freedom to provide services, but not into the UK. Many MGAs maintain dual authorisation (FCA + CBI) to serve both markets. The system needs to understand which entity writes which territorial business, as this affects regulatory reporting, IPT, sanctions screening, and Solvency II obligations.",
    inputType: "single_select",
    options: [
      { value: "uk_only", label: "UK only (FCA-authorised)" },
      { value: "ireland_eea", label: "Ireland + EEA only (CBI-authorised, passporting)" },
      { value: "dual_uk_ireland", label: "Dual authorisation: UK (FCA) + Ireland (CBI) with EEA passporting" },
      { value: "lloyds_global", label: "Lloyd's coverholder (Lloyd's licences cover multiple territories)" },
    ],
    required: true,
    order: 9,
  },
];
