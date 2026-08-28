export const ALARM_NAME = "reading-comfort-boundary";
export const STORAGE_KEY = "pacerState";

export type PacerPhase = "running" | "ready" | "breaking" | "disabled";

export interface PacerSettings {
  intervalMinutes: number;
  breakSeconds: number;
  vibration: boolean;
}

export interface PacerStats {
  completed: number;
  snoozed: number;
  accepted: number;
}

export interface PacerState {
  phase: PacerPhase;
  nextDue: number | null;
  breakStarted: number | null;
  settings: PacerSettings;
  stats: PacerStats;
}

export const DEFAULT_SETTINGS: PacerSettings = {
  intervalMinutes: 20,
  breakSeconds: 20,
  vibration: false
};

const INTERVAL_MINUTES = [10, 20, 30, 45, 60] as const;
const BREAK_SECONDS = [20, 30, 60] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function allowedNumber(value: unknown, allowed: readonly number[], fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) && allowed.includes(value) ? value : fallback;
}

function count(value: unknown): number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : 0;
}

function timestamp(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;
}

export function normalizeSettings(value: unknown): PacerSettings {
  const input = isRecord(value) ? value : {};
  return {
    intervalMinutes: allowedNumber(input.intervalMinutes, INTERVAL_MINUTES, DEFAULT_SETTINGS.intervalMinutes),
    breakSeconds: allowedNumber(input.breakSeconds, BREAK_SECONDS, DEFAULT_SETTINGS.breakSeconds),
    vibration: typeof input.vibration === "boolean" ? input.vibration : DEFAULT_SETTINGS.vibration
  };
}

export function createInitialState(now = Date.now()): PacerState {
  return {
    phase: "running",
    nextDue: now + DEFAULT_SETTINGS.intervalMinutes * 60_000,
    breakStarted: null,
    settings: { ...DEFAULT_SETTINGS },
    stats: { completed: 0, snoozed: 0, accepted: 0 }
  };
}

export function normalizeState(value: unknown, now = Date.now()): PacerState {
  if (!isRecord(value)) return createInitialState(now);
  const input = value;
  const settings = normalizeSettings(input.settings);
  const inputStats = isRecord(input.stats) ? input.stats : {};
  const stats = {
    completed: count(inputStats.completed),
    snoozed: count(inputStats.snoozed),
    accepted: count(inputStats.accepted)
  };
  const allowed: PacerPhase[] = ["running", "ready", "breaking", "disabled"];
  let phase = allowed.includes(input.phase as PacerPhase) ? (input.phase as PacerPhase) : "running";
  let nextDue: number | null = timestamp(input.nextDue) ?? now + settings.intervalMinutes * 60_000;
  let breakStarted = timestamp(input.breakStarted);

  if (phase === "running" && nextDue <= now) phase = "ready";
  if (phase === "ready") nextDue = null;
  if (phase === "breaking" && (breakStarted === null || now - breakStarted > settings.breakSeconds * 2_000)) {
    phase = "running";
    nextDue = now + settings.intervalMinutes * 60_000;
    breakStarted = null;
  }
  if (phase === "disabled") nextDue = null;

  return { phase, nextDue, breakStarted: phase === "breaking" ? breakStarted : null, settings, stats };
}

export function markReady(state: PacerState): PacerState {
  if (state.phase !== "running") return state;
  return { ...state, phase: "ready", nextDue: null };
}

export function snooze(state: PacerState, now = Date.now()): PacerState {
  return {
    ...state,
    phase: "running",
    nextDue: now + 10 * 60_000,
    breakStarted: null,
    stats: { ...state.stats, snoozed: state.stats.snoozed + 1 }
  };
}

export function beginBreak(state: PacerState, now = Date.now(), force = false): PacerState {
  if (state.phase === "breaking") return state;
  if (!force && state.phase !== "ready") return state;
  if (state.phase === "disabled") return state;
  return {
    ...state,
    phase: "breaking",
    nextDue: null,
    breakStarted: now,
    stats: { ...state.stats, accepted: state.stats.accepted + 1 }
  };
}

export function completeBreak(state: PacerState, now = Date.now()): PacerState {
  if (state.phase !== "breaking") return state;
  return {
    ...state,
    phase: "running",
    nextDue: now + state.settings.intervalMinutes * 60_000,
    breakStarted: null,
    stats: { ...state.stats, completed: state.stats.completed + 1 }
  };
}

export function setEnabled(state: PacerState, enabled: boolean, now = Date.now()): PacerState {
  return enabled
    ? { ...state, phase: "running", nextDue: now + state.settings.intervalMinutes * 60_000, breakStarted: null }
    : { ...state, phase: "disabled", nextDue: null, breakStarted: null };
}

export function formatRemaining(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
