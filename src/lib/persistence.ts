"use server";

import { promises as fs } from "fs";
import path from "path";
import { AppState, DecisionState } from "./types";
import { DECISIONS } from "./decisions-data";

// Use /tmp on Vercel (read-only filesystem), local src/data otherwise
const IS_VERCEL = process.env.VERCEL === "1";
const DATA_DIR = IS_VERCEL
  ? "/tmp"
  : path.join(process.cwd(), "src", "data");
const STATE_FILE = path.join(DATA_DIR, "decisions-state.json");

// In-memory cache for serverless warm instances
let memoryCache: AppState | null = null;

/**
 * Create a fresh DecisionState for a given decision ID.
 */
function createEmptyDecisionState(decisionId: string): DecisionState {
  return {
    decisionId,
    status: "open",
    answer: null,
    notes: "",
    attachments: [],
    comments: [],
    flaggedForDiscussion: false,
    lastUpdatedAt: null,
    confirmedAt: null,
    implementedAt: null,
  };
}

/**
 * Build the initial app state from all decision definitions.
 */
function createInitialState(): AppState {
  const decisions: Record<string, DecisionState> = {};
  for (const def of DECISIONS) {
    decisions[def.id] = createEmptyDecisionState(def.id);
  }
  return {
    version: 1,
    lastSavedAt: new Date().toISOString(),
    decisions,
    activityLog: [],
  };
}

/**
 * Load the current app state from the JSON file.
 * Creates initial state if file doesn't exist.
 * Adds new decisions that may have been added to definitions since last save.
 * Uses in-memory cache for Vercel serverless warm instances.
 */
export async function loadState(): Promise<AppState> {
  // Return cached state if available (same serverless invocation)
  if (memoryCache) {
    return memoryCache;
  }

  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const raw = await fs.readFile(STATE_FILE, "utf-8");
    const state = JSON.parse(raw) as AppState;

    // Ensure new decisions added to definitions get state entries
    let updated = false;
    for (const def of DECISIONS) {
      if (!state.decisions[def.id]) {
        state.decisions[def.id] = createEmptyDecisionState(def.id);
        updated = true;
      }
    }
    if (updated) {
      await saveState(state);
    }

    memoryCache = state;
    return state;
  } catch {
    const initial = createInitialState();
    await saveState(initial);
    memoryCache = initial;
    return initial;
  }
}

/**
 * Persist the app state to the JSON file and update in-memory cache.
 */
export async function saveState(state: AppState): Promise<void> {
  state.lastSavedAt = new Date().toISOString();
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2), "utf-8");
  memoryCache = state;
}
