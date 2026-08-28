import "../shared.css";
import "./style.css";
import { browser } from "wxt/browser";
import type { PacerMessage, PacerResponse } from "../../lib/messages";
import { formatRemaining, type PacerState } from "../../lib/pacer";
import { commandHint } from "../../lib/shortcut";

const loading = document.querySelector<HTMLElement>("#loading")!;
const pacer = document.querySelector<HTMLElement>("#pacer")!;
const error = document.querySelector<HTMLElement>("#error")!;
const errorMessage = document.querySelector<HTMLElement>("#error-message")!;
const stateLabel = document.querySelector<HTMLElement>("#state-label")!;
const stateHelp = document.querySelector<HTMLElement>("#state-help")!;
const time = document.querySelector<HTMLElement>("#time")!;
const actions = document.querySelector<HTMLElement>("#actions")!;
const completed = document.querySelector<HTMLElement>("#completed")!;
const shortcut = document.querySelector<HTMLElement>("#shortcut")!;
let current: PacerState | undefined;
let ticker: number | undefined;

async function send(message: PacerMessage): Promise<PacerState> {
  const response = await browser.runtime.sendMessage(message) as PacerResponse;
  if (!response.ok || !response.state) throw new Error(response.error ?? "No response from the pacer.");
  return response.state;
}

function makeButton(label: string, className: string, action: () => Promise<void>): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `button ${className}`;
  button.textContent = label;
  button.addEventListener("click", async () => {
    button.disabled = true;
    try { await action(); } catch (cause) { showError(cause); }
  });
  return button;
}

function render(state: PacerState): void {
  current = state;
  loading.hidden = true;
  error.hidden = true;
  pacer.hidden = false;
  actions.replaceChildren();
  completed.textContent = String(state.stats.completed);

  if (state.phase === "disabled") {
    stateLabel.textContent = "Pacer disabled";
    time.textContent = "—";
    stateHelp.textContent = "No reminders are scheduled. Your settings and local count are kept.";
    actions.append(makeButton("Enable the pacer", "button-primary", async () => render(await send({ type: "SET_ENABLED", enabled: true }))));
    return;
  }

  if (state.phase === "ready") {
    stateLabel.textContent = "Boundary requested";
    time.textContent = "READY";
    stateHelp.textContent = "Keep reading. Pause only when this paragraph or task ends naturally.";
    actions.append(
      makeButton("I’m at a stopping point", "button-primary", async () => { await send({ type: "BEGIN_BREAK" }); window.close(); }),
      makeButton("Snooze 10 minutes", "button-secondary", async () => render(await send({ type: "SNOOZE" })))
    );
    return;
  }

  if (state.phase === "breaking") {
    stateLabel.textContent = "Distance view open";
    time.textContent = "PAUSED";
    stateHelp.textContent = "Return to the distance view, or end this break and start a fresh route.";
    actions.append(
      makeButton("Reopen distance view", "button-primary", async () => { await send({ type: "BEGIN_BREAK", force: true }); window.close(); }),
      makeButton("End break", "button-secondary", async () => render(await send({ type: "COMPLETE_BREAK" })))
    );
    return;
  }

  stateLabel.textContent = "Next boundary request";
  const remaining = (state.nextDue ?? Date.now()) - Date.now();
  time.textContent = formatRemaining(remaining);
  stateHelp.textContent = "We’ll ask after the timer; your page stays uninterrupted until you confirm a boundary.";
  actions.append(makeButton("Take a distance break now", "button-quiet", async () => { await send({ type: "BEGIN_BREAK", force: true }); window.close(); }));
}

function showError(cause: unknown): void {
  loading.hidden = true;
  pacer.hidden = true;
  error.hidden = false;
  errorMessage.textContent = cause instanceof Error ? cause.message : "Reload the extension to try again.";
}

async function load(): Promise<void> {
  loading.hidden = false;
  pacer.hidden = true;
  error.hidden = true;
  try {
    const [next, commands] = await Promise.all([send({ type: "GET_STATE" }), browser.commands.getAll()]);
    render(next);
    shortcut.textContent = commandHint(commands);
  } catch (cause) { showError(cause); }
}

document.querySelector("#retry")?.addEventListener("click", () => void load());
document.querySelector("#open-settings")?.addEventListener("click", () => void browser.runtime.openOptionsPage());

void load();
ticker = window.setInterval(() => {
  if (current?.phase === "running") render(current);
}, 1000);
window.addEventListener("unload", () => window.clearInterval(ticker));
