import { defineBackground } from "wxt/utils/define-background";
import { browser } from "wxt/browser";
import type { PacerMessage, PacerResponse } from "../lib/messages";
import {
  ALARM_NAME,
  STORAGE_KEY,
  beginBreak,
  completeBreak,
  createInitialState,
  markReady,
  normalizeState,
  setEnabled,
  snooze,
  type PacerSettings,
  type PacerState
} from "../lib/pacer";

export default defineBackground(() => {
  async function readState(): Promise<PacerState> {
    const stored = await browser.storage.local.get(STORAGE_KEY);
    const state = normalizeState(stored[STORAGE_KEY]);
    await persist(state);
    return state;
  }

  async function persist(state: PacerState): Promise<void> {
    await browser.storage.local.set({ [STORAGE_KEY]: state });
    await browser.alarms.clear(ALARM_NAME);
    if (state.phase === "running" && state.nextDue) {
      await browser.alarms.create(ALARM_NAME, { when: state.nextDue });
    }
    await browser.action.setBadgeText({ text: state.phase === "ready" ? "PAUSE" : "" });
    await browser.action.setBadgeBackgroundColor({ color: "#B33A2E" });
  }

  async function openBreakPage(): Promise<void> {
    await browser.tabs.create({ url: browser.runtime.getURL("/break.html"), active: true });
  }

  async function initialize(): Promise<void> {
    const stored = await browser.storage.local.get(STORAGE_KEY);
    await persist(stored[STORAGE_KEY] ? normalizeState(stored[STORAGE_KEY]) : createInitialState());
  }

  browser.runtime.onInstalled.addListener(() => void initialize());
  browser.runtime.onStartup.addListener(() => void initialize());

  browser.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name !== ALARM_NAME) return;
    void readState().then((state) => persist(markReady(state)));
  });

  browser.commands.onCommand.addListener((command) => {
    if (command !== "confirm-boundary") return;
    void readState().then(async (state) => {
      if (state.phase !== "ready") return;
      const next = beginBreak(state);
      await persist(next);
      await openBreakPage();
    });
  });

  browser.runtime.onMessage.addListener((message: PacerMessage) => {
    return (async (): Promise<PacerResponse> => {
      try {
        let state = await readState();
        switch (message.type) {
          case "GET_STATE":
            return { ok: true, state };
          case "SNOOZE":
            state = snooze(state);
            break;
          case "BEGIN_BREAK":
            state = beginBreak(state, Date.now(), message.force === true);
            await persist(state);
            if (state.phase === "breaking") await openBreakPage();
            return { ok: true, state };
          case "COMPLETE_BREAK":
            state = completeBreak(state);
            break;
          case "SET_ENABLED":
            state = setEnabled(state, message.enabled);
            break;
          case "SAVE_SETTINGS": {
            const settings: PacerSettings = message.settings;
            state = {
              ...state,
              settings,
              nextDue: state.phase === "running" ? Date.now() + settings.intervalMinutes * 60_000 : state.nextDue
            };
            break;
          }
        }
        await persist(state);
        return { ok: true, state };
      } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : "The pacer could not update." };
      }
    })();
  });
});
