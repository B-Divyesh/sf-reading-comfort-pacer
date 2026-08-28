import "@fontsource-variable/atkinson-hyperlegible-next";
import "./styles.css";

const heading = document.querySelector<HTMLElement>("h1");
const announcement = document.querySelector<HTMLElement>(".route-announcement");
const focusRoute = () => { if (heading) { heading.focus({ preventScroll: true }); if (announcement) announcement.textContent = `${document.title.replace(" — Reading Comfort Pacer", "")} page loaded`; } };
const returningRoute = Boolean((history.state as { pacerRoute?: boolean } | null)?.pacerRoute);
history.replaceState({ ...history.state, pacerRoute: true }, "", location.href);
if (returningRoute || (document.referrer && new URL(document.referrer).origin === location.origin)) focusRoute();
addEventListener("pageshow", (event) => { if ((event as PageTransitionEvent).persisted) focusRoute(); });
if (location.pathname === "/" && new URLSearchParams(location.search).get("demo") === "1") location.replace("/demo/?demo=1");
document.querySelectorAll<HTMLAnchorElement>("[data-download]").forEach((link) => link.addEventListener("click", () => link.setAttribute("data-pressed", "true")));

type DemoPhase = "ready" | "breaking" | "complete";
type DemoState = { phase: DemoPhase; seconds: 20 };
const demoRoot = document.querySelector<HTMLElement>("[data-demo-root]");
const demoKey = "demo:pacer";
if (demoRoot) {
  const initial = (): DemoState => ({ phase: "ready", seconds: 20 });
  const read = (): DemoState => { try { const saved = JSON.parse(localStorage.getItem(demoKey) || "null") as DemoState | null; return saved && ["ready", "breaking", "complete"].includes(saved.phase) ? saved : initial(); } catch { return initial(); } };
  const write = (state: DemoState) => localStorage.setItem(demoKey, JSON.stringify(state));
  const render = () => {
    const state = read();
    const screens: Record<DemoPhase, string> = {
      ready: `<p class="demo-state">Break is ready</p><h1 tabindex="-1">Finish your stopping point, then start a distance break.</h1><p>Sample: you have read a project brief for 20 minutes. The reminder is waiting; it has not interrupted your page.</p><button class="button button-primary" type="button" data-demo-action="start">I’m at a stopping point <span aria-hidden="true">→</span></button>`,
      breaking: `<p class="demo-state">Distance break in progress</p><h1 tabindex="-1">Look beyond the display for 20 seconds.</h1><p class="demo-clock" aria-live="polite">00:20</p><p>Pick a far object in the room or outside. This sample does not use your camera.</p><button class="button button-primary" type="button" data-demo-action="finish">Finish break</button>`,
      complete: `<p class="demo-state">Break complete</p><h1 tabindex="-1">Your next sample reminder is scheduled.</h1><p>You completed one temporary distance break. Reset to see the ready reminder again.</p><button class="button button-outline" type="button" data-demo-action="reset">Reset demo</button>`
    };
    demoRoot.innerHTML = screens[state.phase];
    demoRoot.querySelector<HTMLButtonElement>("[data-demo-action]")?.addEventListener("click", (event) => { const action = (event.currentTarget as HTMLElement).dataset.demoAction; write(action === "start" ? { phase: "breaking", seconds: 20 } : action === "finish" ? { phase: "complete", seconds: 20 } : initial()); render(); demoRoot.querySelector<HTMLElement>("h1")?.focus(); });
  };
  document.querySelector<HTMLButtonElement>("[data-reset-demo]")?.addEventListener("click", () => { write(initial()); render(); });
  document.querySelector<HTMLAnchorElement>("[data-start-real]")?.addEventListener("click", () => localStorage.removeItem(demoKey));
  render();
  demoRoot.querySelector<HTMLElement>("h1")?.focus({ preventScroll: true });
}
