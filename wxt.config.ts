import { defineConfig } from "wxt";

export default defineConfig({
  outDir: "dist/extension",
  manifest: {
    name: "Reading Comfort Pacer",
    description: "Ask for a distance break at your next natural reading boundary.",
    version: "1.0.0",
    permissions: ["storage", "alarms"],
    action: { default_title: "Reading Comfort Pacer" },
    commands: {
      "confirm-boundary": {
        suggested_key: { default: "Alt+Shift+R", mac: "Command+Shift+Y" },
        description: "Start a ready distance break"
      }
    },
    icons: {
      16: "icon/16.png",
      32: "icon/32.png",
      48: "icon/48.png",
      128: "icon/128.png"
    },
    browser_specific_settings: {
      gecko: { id: "reading-comfort-pacer@sociobot.in", strict_min_version: "109.0" }
    }
  }
});
