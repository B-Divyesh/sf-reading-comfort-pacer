import "../shared.css";
import "./style.css";
import { browser } from "wxt/browser";
import type { PacerResponse } from "../../lib/messages";
import { formatRemaining, type PacerState } from "../../lib/pacer";

const countdown = document.querySelector<HTMLElement>("#countdown")!;
const title = document.querySelector<HTMLElement>("#break-title")!;
const instruction = document.querySelector<HTMLElement>("#instruction")!;
const finish = document.querySelector<HTMLButtonElement>("#finish")!;
const motion = document.querySelector<HTMLButtonElement>("#motion")!;
const status = document.querySelector<HTMLElement>("#status")!;
let state: PacerState | undefined;
let timer: number | undefined;
let completed = false;

async function getState(): Promise<PacerState> {
  const response = await browser.runtime.sendMessage({ type: "GET_STATE" }) as PacerResponse;
  if (!response.ok || !response.state) throw new Error(response.error ?? "The break could not start.");
  return response.state;
}

async function complete(): Promise<void> {
  if (completed) return;
  completed = true;
  window.clearInterval(timer);
  const response = await browser.runtime.sendMessage({ type: "COMPLETE_BREAK" }) as PacerResponse;
  if (!response.ok) {
    completed = false;
    status.textContent = "Could not save this break. Keep this tab open and try again.";
    finish.disabled = false;
    return;
  }
  if (state?.settings.vibration && "vibrate" in navigator) navigator.vibrate([70, 50, 70]);
  document.body.classList.add("is-complete");
  title.textContent = "Route refreshed";
  instruction.textContent = "Your next reading interval starts now. Return when you’re ready.";
  countdown.textContent = "DONE";
  finish.textContent = "Return to reading";
  finish.disabled = false;
  finish.onclick = () => window.close();
  motion.hidden = true;
  status.textContent = "Break completed and saved on this device.";
}

function tick(): void {
  if (!state?.breakStarted) return;
  const remaining = state.settings.breakSeconds * 1000 - (Date.now() - state.breakStarted);
  countdown.textContent = formatRemaining(remaining);
  if (remaining <= 0) void complete();
}

finish.addEventListener("click", () => {
  finish.disabled = true;
  void complete();
});

motion.addEventListener("click", () => {
  const paused = document.body.classList.toggle("motion-paused");
  motion.setAttribute("aria-pressed", String(paused));
  motion.textContent = paused ? "Resume gentle motion" : "Pause gentle motion";
});

void getState().then((next) => {
  state = next;
  if (next.phase !== "breaking" || !next.breakStarted) {
    title.textContent = "This route is already complete";
    instruction.textContent = "Open the pacer when you’re ready to begin another reading interval.";
    countdown.textContent = "—";
    finish.textContent = "Close distance view";
    finish.onclick = () => window.close();
    motion.hidden = true;
    return;
  }
  if (next.settings.vibration && "vibrate" in navigator) navigator.vibrate(70);
  tick();
  timer = window.setInterval(tick, 250);
}).catch((cause) => {
  status.textContent = cause instanceof Error ? cause.message : "The break could not start. Close this tab and try again.";
  countdown.textContent = "—";
});

window.addEventListener("unload", () => window.clearInterval(timer));
