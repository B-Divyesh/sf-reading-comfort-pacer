import "../shared.css";
import "./style.css";
import { browser } from "wxt/browser";
import type { PacerMessage, PacerResponse } from "../../lib/messages";
import type { PacerState } from "../../lib/pacer";

const form = document.querySelector<HTMLFormElement>("#settings-form")!;
const saveStatus = document.querySelector<HTMLElement>("#save-status")!;
let state: PacerState | undefined;

async function send(message: PacerMessage): Promise<PacerState> {
  const response = await browser.runtime.sendMessage(message) as PacerResponse;
  if (!response.ok || !response.state) throw new Error(response.error ?? "The pacer did not respond.");
  return response.state;
}

function fill(next: PacerState): void {
  state = next;
  const interval = form.querySelector<HTMLInputElement>(`input[name="interval"][value="${next.settings.intervalMinutes}"]`);
  if (interval) interval.checked = true;
  form.elements.namedItem("breakSeconds") && ((form.elements.namedItem("breakSeconds") as HTMLSelectElement).value = String(next.settings.breakSeconds));
  (form.elements.namedItem("vibration") as HTMLInputElement).checked = next.settings.vibration;
  (form.elements.namedItem("enabled") as HTMLInputElement).checked = next.phase !== "disabled";
  document.querySelector("#completed")!.textContent = String(next.stats.completed);
}

async function load(): Promise<void> {
  try { fill(await send({ type: "GET_STATE" })); }
  catch { form.hidden = true; document.querySelector<HTMLElement>("#load-error")!.hidden = false; }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  submit.disabled = true;
  saveStatus.textContent = "Saving…";
  try {
    let next = await send({
      type: "SAVE_SETTINGS",
      settings: {
        intervalMinutes: Number(data.get("interval")),
        breakSeconds: Number(data.get("breakSeconds")),
        vibration: data.get("vibration") === "on"
      }
    });
    const enabled = data.get("enabled") === "on";
    if ((next.phase !== "disabled") !== enabled) next = await send({ type: "SET_ENABLED", enabled });
    fill(next);
    saveStatus.textContent = "Saved on this device.";
  } catch {
    saveStatus.textContent = "Could not save. Try again.";
  } finally { submit.disabled = false; }
});

void load();
