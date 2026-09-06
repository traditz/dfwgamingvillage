// PATH: site/launchers.js
// The PC launcher a session is played on. This is the field that replaces the
// board-game planner's `gameSource` ("personal" | "library"): everything is
// PC, so the launcher badge is what tells attendees where to meet.

import { esc } from "./shared.js";

export const LAUNCHERS = {
  steam: {
    key: "steam",
    label: "Steam",
    hint: "Steam client"
  },
  xbox_pc: {
    key: "xbox_pc",
    label: "Xbox PC / Game Pass",
    hint: "Xbox app on Windows (Microsoft Store or PC Game Pass)"
  },
  battlenet: {
    key: "battlenet",
    label: "Battle.net",
    hint: "Blizzard's Battle.net launcher"
  },
  other: {
    key: "other",
    label: "Other launcher",
    hint: "Epic, GOG Galaxy, Ubisoft Connect, EA App, standalone…"
  }
};

export const LAUNCHER_ORDER = ["steam", "xbox_pc", "battlenet", "other"];

export function launcherMeta(key) {
  return LAUNCHERS[key] || LAUNCHERS.other;
}

// The launcher to pre-select on the host form. When IGDB points at exactly
// one launcher we pick it; when several are plausible we prefer Steam because
// it's where most of the community's PC copies live; otherwise nothing.
export function defaultLauncher(game) {
  const detected = LAUNCHER_ORDER.filter((k) => k !== "other" && game?.launchers?.[k]?.detected);
  if (detected.length === 1) return detected[0];
  if (detected.includes("steam")) return "steam";
  return detected[0] || "";
}

export function storeUrlFor(game, key) {
  if (!game) return "";
  if (key === "steam") return game.launchers?.steam?.storeUrl || game.links?.steam || "";
  if (key === "xbox_pc") return game.launchers?.xbox_pc?.storeUrl || game.links?.xbox || "";
  if (key === "battlenet") return game.launchers?.battlenet?.storeUrl || game.links?.official || "";
  return game.links?.official || "";
}

// IGDB has no cross-play field, so we seed the host's note from what we know
// about the publisher. The host can edit or clear it.
export function crossplayHint(game) {
  const publishers = (game?.publishers || []).map((p) => p.toLowerCase());
  const l = game?.launchers || {};
  if (publishers.includes("blizzard entertainment")) {
    return "Steam and Battle.net copies play together through a linked Battle.net account.";
  }
  if (publishers.some((p) => p.includes("activision")) && l.battlenet?.detected) {
    return "Steam and Battle.net copies play together through a linked Activision account.";
  }
  if (publishers.some((p) => p.includes("xbox game studios") || p.includes("microsoft"))) {
    return "Xbox PC and Steam copies generally play together through an Xbox network account.";
  }
  if (l.steam?.detected && l.xbox_pc?.detected) {
    return "Check whether Steam and Xbox PC copies can play together before inviting mixed groups.";
  }
  return "";
}

export function badgeHtml(key, labelOverride = "") {
  const meta = launcherMeta(key);
  const label = labelOverride || meta.label;
  return `<span class="launcherBadge is-${esc(meta.key)}"><span class="launcherDot" aria-hidden="true"></span>${esc(label)}</span>`;
}
