/**
 * TDD tests for InsureWright Onboarding — Ireland / UK / EEA regionalization
 *
 * These tests validate:
 * 1. Structural integrity (88 decisions, 10 categories, correct IDs)
 * 2. US content ELIMINATED (no NAICS, NAIC, OFAC, FEIN, $, etc.)
 * 3. Regional content PRESENT (FCA, CBI, Lloyd's, UK SIC, GDPR, etc.)
 * 4. Key decision spot-checks
 */

import { CATEGORIES, DECISIONS } from "./decisions-data";
import { APP_NAME, APP_DESCRIPTION } from "./constants";

// ============================================================
// GROUP 1: STRUCTURAL INTEGRITY
// ============================================================

describe("CATEGORIES", () => {
  it("exports exactly 10 categories", () => {
    expect(CATEGORIES).toHaveLength(10);
  });

  it("has correct slugs in order", () => {
    const slugs = CATEGORIES.map((c) => c.slug);
    expect(slugs).toEqual([
      "appetite-business-rules",
      "lines-of-business",
      "data-fields-requirements",
      "document-standards",
      "rating-methodology",
      "workflow-sops",
      "adverse-news-criteria",
      "compliance-audit",
      "quote-packaging",
      "measures-success-criteria",
    ]);
  });

  it("each category has required fields", () => {
    for (const cat of CATEGORIES) {
      expect(cat).toHaveProperty("slug");
      expect(cat).toHaveProperty("name");
      expect(cat).toHaveProperty("icon");
      expect(cat).toHaveProperty("order");
      expect(typeof cat.slug).toBe("string");
      expect(typeof cat.name).toBe("string");
      expect(typeof cat.icon).toBe("string");
      expect(typeof cat.order).toBe("number");
    }
  });

  it("category orders are sequential from 1 to 10", () => {
    const orders = CATEGORIES.map((c) => c.order);
    expect(orders).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
});

describe("DECISIONS", () => {
  it("exports exactly 88 decisions (82 regionalized + 6 new)", () => {
    // ABR(13) + LOB(5) + DFR(14) + DOC(4) + RAT(8) + WFL(10) + ADV(7) + CMP(10) + QPK(8) + MSC(9) = 88
    expect(DECISIONS).toHaveLength(88);
  });

  it("every decision has a unique ID", () => {
    const ids = DECISIONS.map((d) => d.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("every decision references a valid category slug", () => {
    const validSlugs = new Set(CATEGORIES.map((c) => c.slug));
    for (const dec of DECISIONS) {
      expect(validSlugs.has(dec.categorySlug)).toBe(true);
    }
  });
});

describe("Decision ID prefixes and counts per category", () => {
  it("Appetite & Business Rules has 13 decisions with prefix ABR-", () => {
    const abr = DECISIONS.filter((d) => d.categorySlug === "appetite-business-rules");
    expect(abr).toHaveLength(13);
    abr.forEach((d) => expect(d.id).toMatch(/^ABR-\d{3}$/));
  });

  it("Lines of Business has 5 decisions with prefix LOB-", () => {
    const lob = DECISIONS.filter((d) => d.categorySlug === "lines-of-business");
    expect(lob).toHaveLength(5);
    lob.forEach((d) => expect(d.id).toMatch(/^LOB-\d{3}$/));
  });

  it("Data Fields & Requirements has 14 decisions with prefix DFR-", () => {
    const dfr = DECISIONS.filter((d) => d.categorySlug === "data-fields-requirements");
    expect(dfr).toHaveLength(14);
    dfr.forEach((d) => expect(d.id).toMatch(/^DFR-\d{3}$/));
  });

  it("Document Standards has 4 decisions with prefix DOC-", () => {
    const doc = DECISIONS.filter((d) => d.categorySlug === "document-standards");
    expect(doc).toHaveLength(4);
    doc.forEach((d) => expect(d.id).toMatch(/^DOC-\d{3}$/));
  });

  it("Rating Methodology has 8 decisions with prefix RAT-", () => {
    const rat = DECISIONS.filter((d) => d.categorySlug === "rating-methodology");
    expect(rat).toHaveLength(8);
    rat.forEach((d) => expect(d.id).toMatch(/^RAT-\d{3}$/));
  });

  it("Workflow & SOPs has 10 decisions with prefix WFL-", () => {
    const wfl = DECISIONS.filter((d) => d.categorySlug === "workflow-sops");
    expect(wfl).toHaveLength(10);
    wfl.forEach((d) => expect(d.id).toMatch(/^WFL-\d{3}$/));
  });

  it("Adverse News Criteria has 7 decisions with prefix ADV-", () => {
    const adv = DECISIONS.filter((d) => d.categorySlug === "adverse-news-criteria");
    expect(adv).toHaveLength(7);
    adv.forEach((d) => expect(d.id).toMatch(/^ADV-\d{3}$/));
  });

  it("Compliance & Audit has 10 decisions with prefix CMP-", () => {
    const cmp = DECISIONS.filter((d) => d.categorySlug === "compliance-audit");
    expect(cmp).toHaveLength(10);
    cmp.forEach((d) => expect(d.id).toMatch(/^CMP-\d{3}$/));
  });

  it("Quote Packaging has 8 decisions with prefix QPK-", () => {
    const qpk = DECISIONS.filter((d) => d.categorySlug === "quote-packaging");
    expect(qpk).toHaveLength(8);
    qpk.forEach((d) => expect(d.id).toMatch(/^QPK-\d{3}$/));
  });

  it("Measures & Success Criteria has 9 decisions with prefix MSC-", () => {
    const msc = DECISIONS.filter((d) => d.categorySlug === "measures-success-criteria");
    expect(msc).toHaveLength(9);
    msc.forEach((d) => expect(d.id).toMatch(/^MSC-\d{3}$/));
  });

  it("all IDs follow one of the expected prefixes", () => {
    const validPrefixes = ["ABR-", "LOB-", "DFR-", "DOC-", "RAT-", "WFL-", "ADV-", "CMP-", "QPK-", "MSC-"];
    for (const dec of DECISIONS) {
      const hasValidPrefix = validPrefixes.some((p) => dec.id.startsWith(p));
      expect(hasValidPrefix).toBe(true);
    }
  });
});

describe("Decision field validation", () => {
  it("every decision has required fields", () => {
    for (const dec of DECISIONS) {
      expect(dec).toHaveProperty("id");
      expect(dec).toHaveProperty("categorySlug");
      expect(dec).toHaveProperty("title");
      expect(dec).toHaveProperty("question");
      expect(dec).toHaveProperty("context");
      expect(dec).toHaveProperty("inputType");
      expect(dec).toHaveProperty("required");
      expect(dec).toHaveProperty("order");
      expect(typeof dec.id).toBe("string");
      expect(typeof dec.title).toBe("string");
      expect(typeof dec.question).toBe("string");
      expect(typeof dec.context).toBe("string");
      expect(dec.title.length).toBeGreaterThan(0);
      expect(dec.question.length).toBeGreaterThan(0);
    }
  });

  it("single_select and multi_select decisions have options", () => {
    const selectDecisions = DECISIONS.filter(
      (d) => d.inputType === "single_select" || d.inputType === "multi_select"
    );
    expect(selectDecisions.length).toBeGreaterThan(0);
    for (const dec of selectDecisions) {
      expect(dec.options).toBeDefined();
      expect(Array.isArray(dec.options)).toBe(true);
      expect(dec.options!.length).toBeGreaterThan(0);
      for (const opt of dec.options!) {
        expect(opt).toHaveProperty("value");
        expect(opt).toHaveProperty("label");
      }
    }
  });

  it("data_table decisions have tableColumns", () => {
    const tableDecisions = DECISIONS.filter((d) => d.inputType === "data_table");
    expect(tableDecisions.length).toBeGreaterThan(0);
    for (const dec of tableDecisions) {
      expect(dec.tableColumns).toBeDefined();
      expect(Array.isArray(dec.tableColumns)).toBe(true);
      expect(dec.tableColumns!.length).toBeGreaterThan(0);
      for (const col of dec.tableColumns!) {
        expect(col).toHaveProperty("key");
        expect(col).toHaveProperty("label");
        expect(col).toHaveProperty("type");
      }
    }
  });

  it("every category has at least 1 required decision", () => {
    for (const cat of CATEGORIES) {
      const requiredInCat = DECISIONS.filter(
        (d) => d.categorySlug === cat.slug && d.required
      );
      expect(requiredInCat.length).toBeGreaterThan(0);
    }
  });
});

// ============================================================
// GROUP 2: US CONTENT ELIMINATED
// ============================================================

describe("US-specific content is eliminated", () => {
  // Helper: collect all searchable text from a decision
  const getAllText = (dec: (typeof DECISIONS)[0]): string => {
    const parts = [dec.title, dec.question, dec.context, dec.placeholder || ""];
    if (dec.options) {
      for (const opt of dec.options) {
        parts.push(opt.label, opt.description || "");
      }
    }
    if (dec.tableColumns) {
      for (const col of dec.tableColumns) {
        parts.push(col.label);
        if (col.options) parts.push(...col.options);
      }
    }
    return parts.join(" ");
  };

  const allText = () => DECISIONS.map(getAllText).join(" ");

  it("no decision contains 'NAICS'", () => {
    expect(allText()).not.toMatch(/NAICS/i);
  });

  it("no decision contains 'NAIC ' (US regulatory body)", () => {
    // Match "NAIC" followed by space/punctuation (not part of "NAICS")
    expect(allText()).not.toMatch(/\bNAIC\b/);
  });

  it("no decision contains 'NCCI'", () => {
    expect(allText()).not.toMatch(/NCCI/i);
  });

  it("no decision contains 'OSHA'", () => {
    expect(allText()).not.toMatch(/OSHA/i);
  });

  it("no decision contains 'Workers Compensation' or 'Workers\\' Compensation'", () => {
    expect(allText()).not.toMatch(/workers['']?\s*comp/i);
  });

  it("no decision contains 'General Liability' as a product name", () => {
    expect(allText()).not.toMatch(/General Liability/i);
  });

  it("no decision contains 'Business Owners Policy' or 'BOP'", () => {
    expect(allText()).not.toMatch(/Business Owners Policy/i);
    // Check BOP as standalone word (not part of other words)
    expect(allText()).not.toMatch(/\bBOP\b/);
  });

  it("no decision contains 'ACORD'", () => {
    expect(allText()).not.toMatch(/ACORD/i);
  });

  it("no decision contains 'FEIN' or 'federal tax'", () => {
    expect(allText()).not.toMatch(/\bFEIN\b/);
    expect(allText()).not.toMatch(/federal tax/i);
  });

  it("no decision contains '$' as currency symbol", () => {
    // Match $ followed by a digit (currency usage), not in code context
    expect(allText()).not.toMatch(/\$\d/);
    // Also check table column labels for ($) pattern
    for (const dec of DECISIONS) {
      if (dec.tableColumns) {
        for (const col of dec.tableColumns) {
          expect(col.label).not.toMatch(/\(\$\)/);
        }
      }
    }
  });

  it("no decision contains 'Model Audit Rule'", () => {
    expect(allText()).not.toMatch(/Model Audit Rule/i);
  });

  it("no decision contains US state regulatory references (California, New York, Colorado)", () => {
    expect(allText()).not.toMatch(/\bCalifornia\b/i);
    expect(allText()).not.toMatch(/\bNew York\b/i);
    expect(allText()).not.toMatch(/\bColorado\b/i);
  });

  it("no decision contains 'ISO classification scale'", () => {
    expect(allText()).not.toMatch(/ISO classification scale/i);
  });

  it("no decision contains 'zip code'", () => {
    expect(allText()).not.toMatch(/zip\s*code/i);
  });

  it("no decision contains 'state DOI'", () => {
    expect(allText()).not.toMatch(/state DOI/i);
  });

  it("no decision contains 'OFAC' except in CMP-010 context", () => {
    const nonCmp010 = DECISIONS.filter((d) => d.id !== "CMP-010");
    const text = nonCmp010.map(getAllText).join(" ");
    expect(text).not.toMatch(/\bOFAC\b/);
  });
});

// ============================================================
// GROUP 3: REGIONAL CONTENT PRESENT
// ============================================================

describe("Ireland/UK/EEA regional content is present", () => {
  const allText = () =>
    DECISIONS.map((d) => {
      const parts = [d.title, d.question, d.context, d.placeholder || ""];
      if (d.options) {
        for (const opt of d.options) parts.push(opt.label, opt.description || "");
      }
      if (d.tableColumns) {
        for (const col of d.tableColumns) parts.push(col.label);
      }
      return parts.join(" ");
    }).join(" ");

  it("mentions FCA (Financial Conduct Authority)", () => {
    expect(allText()).toMatch(/FCA/);
  });

  it("mentions CBI or Central Bank of Ireland", () => {
    expect(allText()).toMatch(/CBI|Central Bank of Ireland/i);
  });

  it("mentions Lloyd's", () => {
    expect(allText()).toMatch(/Lloyd['']s/);
  });

  it("mentions UK SIC", () => {
    expect(allText()).toMatch(/UK SIC/i);
  });

  it("mentions NACE", () => {
    expect(allText()).toMatch(/NACE/i);
  });

  it("mentions GDPR", () => {
    expect(allText()).toMatch(/GDPR/i);
  });

  it("mentions EU AI Act", () => {
    expect(allText()).toMatch(/EU AI Act/i);
  });

  it("mentions Employers' Liability or EL", () => {
    expect(allText()).toMatch(/Employers['']?\s*Liability/i);
  });

  it("mentions Public Liability", () => {
    expect(allText()).toMatch(/Public Liability/i);
  });

  it("mentions Commercial Combined", () => {
    expect(allText()).toMatch(/Commercial Combined/i);
  });

  it("mentions MRC or Market Reform Contract", () => {
    expect(allText()).toMatch(/MRC|Market Reform Contract/i);
  });

  it("mentions OFSI", () => {
    expect(allText()).toMatch(/OFSI/i);
  });

  it("mentions HSE (Health & Safety Executive)", () => {
    expect(allText()).toMatch(/HSE/i);
  });

  it("mentions Companies House", () => {
    expect(allText()).toMatch(/Companies House/i);
  });

  it("mentions Postcode or Eircode", () => {
    expect(allText()).toMatch(/[Pp]ostcode|Eircode/i);
  });

  it("mentions coverholder or delegated authority", () => {
    expect(allText()).toMatch(/coverholder|delegated authority/i);
  });

  it("mentions GBP (£) or EUR (€) currency", () => {
    expect(allText()).toMatch(/[£€]/);
  });

  it("mentions IPT (Insurance Premium Tax)", () => {
    expect(allText()).toMatch(/IPT|Insurance Premium Tax/i);
  });

  it("mentions Solvency II", () => {
    expect(allText()).toMatch(/Solvency II|Solvency 2/i);
  });

  it("mentions DA SATS or DDM", () => {
    expect(allText()).toMatch(/DA SATS|DDM/i);
  });

  it("mentions turnover (UK term for revenue)", () => {
    expect(allText()).toMatch(/turnover/i);
  });

  it("mentions SFO (Serious Fraud Office)", () => {
    expect(allText()).toMatch(/SFO/i);
  });
});

// ============================================================
// GROUP 4: KEY DECISION SPOT CHECKS
// ============================================================

describe("Key decision spot checks", () => {
  it("ABR-002 title contains 'UK SIC' or 'NACE'", () => {
    const dec = DECISIONS.find((d) => d.id === "ABR-002");
    expect(dec).toBeDefined();
    expect(dec!.title).toMatch(/UK SIC|NACE/i);
  });

  it("LOB-001 options include regional lines and exclude US lines", () => {
    const dec = DECISIONS.find((d) => d.id === "LOB-001");
    expect(dec).toBeDefined();
    const values = dec!.options!.map((o) => o.value);
    expect(values).toContain("public_liability");
    expect(values).toContain("el");
    expect(values).toContain("commercial_combined");
    expect(values).not.toContain("wc");
    expect(values).not.toContain("bop");
  });

  it("DFR-004 title contains 'UK SIC' and 'NACE'", () => {
    const dec = DECISIONS.find((d) => d.id === "DFR-004");
    expect(dec).toBeDefined();
    expect(dec!.title).toMatch(/UK SIC/i);
    expect(dec!.title).toMatch(/NACE/i);
  });

  it("DOC-001 title does NOT contain 'ACORD'", () => {
    const dec = DECISIONS.find((d) => d.id === "DOC-001");
    expect(dec).toBeDefined();
    expect(dec!.title).not.toMatch(/ACORD/i);
  });

  it("CMP-001 title contains 'EU AI Act' or 'FCA'", () => {
    const dec = DECISIONS.find((d) => d.id === "CMP-001");
    expect(dec).toBeDefined();
    expect(dec!.title).toMatch(/EU AI Act|FCA/i);
  });

  it("CMP-010 is multi_select for sanctions lists", () => {
    const dec = DECISIONS.find((d) => d.id === "CMP-010");
    expect(dec).toBeDefined();
    expect(dec!.inputType).toBe("multi_select");
    const values = dec!.options!.map((o) => o.value);
    expect(values).toContain("ofsi");
    expect(values).toContain("eu_consolidated");
  });

  it("MSC-007 is data_table for IPT rates", () => {
    const dec = DECISIONS.find((d) => d.id === "MSC-007");
    expect(dec).toBeDefined();
    expect(dec!.inputType).toBe("data_table");
    expect(dec!.title).toMatch(/IPT|Insurance Premium Tax/i);
  });

  it("WFL-010 is single_select for delegated authority type", () => {
    const dec = DECISIONS.find((d) => d.id === "WFL-010");
    expect(dec).toBeDefined();
    expect(dec!.inputType).toBe("single_select");
    expect(dec!.title).toMatch(/[Dd]elegated [Aa]uthority/i);
  });

  it("MSC-009 is single_select for cross-border passporting", () => {
    const dec = DECISIONS.find((d) => d.id === "MSC-009");
    expect(dec).toBeDefined();
    expect(dec!.inputType).toBe("single_select");
  });

  it("CMP-009 covers GDPR data processing", () => {
    const dec = DECISIONS.find((d) => d.id === "CMP-009");
    expect(dec).toBeDefined();
    expect(dec!.title).toMatch(/GDPR/i);
    expect(dec!.inputType).toBe("free_text");
  });

  it("MSC-008 covers DA SATS / DDM reporting", () => {
    const dec = DECISIONS.find((d) => d.id === "MSC-008");
    expect(dec).toBeDefined();
    expect(dec!.title).toMatch(/DA SATS|DDM/i);
  });
});

// ============================================================
// GROUP 5: APP BRANDING
// ============================================================

describe("App branding", () => {
  it("APP_NAME is InsureWright Onboarding", () => {
    expect(APP_NAME).toBe("InsureWright Onboarding");
  });

  it("APP_DESCRIPTION references Ireland, UK, or EEA", () => {
    expect(APP_DESCRIPTION).toMatch(/Ireland|UK|EEA/i);
  });
});
