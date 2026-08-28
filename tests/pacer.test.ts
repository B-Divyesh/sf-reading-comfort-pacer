import { describe, expect, it } from "vitest";
import { beginBreak, completeBreak, createInitialState, formatRemaining, markReady, normalizeState, setEnabled, snooze } from "../lib/pacer";

describe("pacer state", () => {
  it("starts a local twenty-minute route", () => {
    const state = createInitialState(1_000);
    expect(state.phase).toBe("running");
    expect(state.nextDue).toBe(1_201_000);
  });

  it("waits at ready until the user confirms a boundary", () => {
    const ready = markReady(createInitialState(0));
    expect(ready.phase).toBe("ready");
    expect(ready.nextDue).toBeNull();
    const breaking = beginBreak(ready, 5_000);
    expect(breaking.phase).toBe("breaking");
    expect(breaking.stats.accepted).toBe(1);
  });

  it("snoozes intentionally for ten minutes", () => {
    const state = snooze(markReady(createInitialState(0)), 10_000);
    expect(state.nextDue).toBe(610_000);
    expect(state.stats.snoozed).toBe(1);
  });

  it("schedules the selected interval after completion", () => {
    const state = createInitialState(0);
    state.settings.intervalMinutes = 30;
    const done = completeBreak(beginBreak(markReady(state), 1_000), 2_000);
    expect(done.stats.completed).toBe(1);
    expect(done.nextDue).toBe(1_802_000);
  });

  it("fully disables and restores the pacer", () => {
    const disabled = setEnabled(createInitialState(0), false, 5_000);
    expect(disabled).toMatchObject({ phase: "disabled", nextDue: null });
    expect(setEnabled(disabled, true, 5_000).nextDue).toBe(1_205_000);
  });

  it("recovers timers that elapsed while the browser was asleep", () => {
    const state = createInitialState(0);
    expect(normalizeState(state, 1_300_000).phase).toBe("ready");
  });

  it("formats stable, tabular countdown text", () => {
    expect(formatRemaining(61_000)).toBe("01:01");
    expect(formatRemaining(-1)).toBe("00:00");
  });
});
