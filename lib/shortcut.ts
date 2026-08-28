interface BrowserCommand {
  name?: string;
  shortcut?: string;
}

export function commandHint(commands: BrowserCommand[]): string {
  const shortcut = commands.find((command) => command.name === "confirm-boundary")?.shortcut?.trim();
  if (!shortcut) return "Keyboard shortcut not assigned. Set one in your browser’s extension shortcuts.";
  return `${shortcut.replaceAll("+", " + ")} at a ready boundary`;
}
