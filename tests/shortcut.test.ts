import { describe, expect, it } from "vitest";
import { commandHint } from "../lib/shortcut";

describe("keyboard command messaging", () => {
  it("shows the shortcut actually assigned by the browser", () => {
    expect(commandHint([{ name: "confirm-boundary", shortcut: "Alt+Shift+R" }]))
      .toBe("Alt + Shift + R at a ready boundary");
  });

  it("does not advertise an unassigned suggested shortcut", () => {
    expect(commandHint([{ name: "confirm-boundary", shortcut: "" }]))
      .toBe("Keyboard shortcut not assigned. Set one in your browser’s extension shortcuts.");
  });
});
