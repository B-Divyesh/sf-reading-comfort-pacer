import type { PacerSettings, PacerState } from "./pacer";

export type PacerMessage =
  | { type: "GET_STATE" }
  | { type: "SNOOZE" }
  | { type: "BEGIN_BREAK"; force?: boolean }
  | { type: "COMPLETE_BREAK" }
  | { type: "SET_ENABLED"; enabled: boolean }
  | { type: "SAVE_SETTINGS"; settings: PacerSettings };

export interface PacerResponse {
  ok: boolean;
  state?: PacerState;
  error?: string;
}
