# DFWGV Planner — Design System

**Shipped: Direction D (Gallery + Schedule).** The planner page uses a date
rail of game days (a "Change" list on phones), a wide all-caps game day
header tinted by its box art, day tabs for multi-day events, and box-art
cards grouped under their start time, with no pager. Type is Archivo for
display and times, Inter for everything else. Layout lives in
`planner.css`; `styles.css` stays shared with Events and Admin.

Events (`events/`), Admin (`admin/`) and the Discord sign-in page use D too:
they load `planner.css` plus their own layout file, and share icons, avatars,
date blocks and the seat meter through `ui.js`. The video game planner
(`/vgplanner/`) has its own `styles.css` with the same tokens and imports
`ui.js` from here.

The palette is inherited and locked: near-black surfaces, DFWGV red, gold.
No brand color changes here. What changes is the job each color does, the
type scale, and the component set. Those three things are what make a solid
app read as a hobby page instead of a product.

This direction is **not** based on reference sites (UXKIN isn't connected).
It comes from the existing `styles.css` tokens, the logo, and general
craft rules.

---

## 1. Color

### Neutrals

| Token | Value | Role |
|---|---|---|
| `--bg` | `#0a0a0e` | Page background |
| `--bg-2` | `#101016` | Sidebar, inset wells, inputs |
| `--card` | `#16161d` | Cards and panels |
| `--raised` | `#1c1c24` | Menus, modals, sheets |
| `--s1`…`--s4` | white at 3.2 / 5.5 / 8 / 12% | Quiet fills, from row hover up to empty pip |
| `--line` | white at 7% | Hairline dividers |
| `--line-strong` | white at 14% | Input and secondary-button borders |
| `--text` | `#f1f2f5` | Primary text (17:1 on `--card`) |
| `--muted` | `#9a9ba7` | Secondary text (6.4:1 on `--card`) |
| `--dim` | `#858692` | Tertiary text and labels (4.9:1 on `--card`, the lowest value that still passes AA) |

A surface gets a hairline **or** a shadow, never both at the same level.

### Red: brand, primary action, and "yours"

| Token | Value | Role |
|---|---|---|
| `--accent` | `#d32f34` | Fills only: the primary button, the active nav indicator |
| `--accent-2` | `#e8464b` | Primary hover |
| `--accent-text` | `#f87171` | Red as text: links, "(you)", the Hosting pill, focus rings |
| `--accent-soft` | `rgba(211,47,52,.14)` | Selected rows, the Hosting pill fill |

`#d32f34` is never small text. It measures 3.6:1 on `--card`, which fails AA,
so red type always uses `--accent-text` (6.1:1). White on an `--accent` fill
measures 4.96:1. That passes, but only just, so button labels stay at 14px or
larger and weight 600.

### Gold: waitlist and restricted access

| Token | Value | Role |
|---|---|---|
| `--gold` | `#f5c542` | Waitlist pips, the Full and Waitlist pills, Private events, the inbox count |
| `--gold-soft` | `rgba(245,197,66,.13)` | Fill behind gold text |

Gold is the strongest text color on these surfaces (10.9:1). That makes it
right for the one thing people scan for before they join: whether a seat is
real or a waitlist spot. Gold is never decoration. A library copy is a neutral
pill.

### Semantic

| Token | Value | Role |
|---|---|---|
| `--success` | `#2fbf6b` | Confirmed seat pips, the Joined state |
| `--warning` | `#f59e0b` | Started |
| `--info` | `#8fbcff` | Custom sign-up entries (food runs, setup crew) |
| `--danger` | `#ef4444` | Destructive actions. **Text and border only, never a fill.** |

A filled red Delete next to a filled red Join is why the current cards feel
tense. Destructive buttons are quiet, with `--danger` text. In a confirmation
dialog, the confirm button gets a `--danger` outline, not a fill.

---

## 2. Typography

**Inter stays as the body and UI face.** It's already loaded and already the
brand. Each sample direction tries a different display face for headings
and numbers. Pick one, or keep Inter everywhere:

| Direction | Display / numbers | Why |
|---|---|---|
| A · Workspace | Geist throughout, Geist Mono for numbers | Inter's closest relative, so the smallest change. Mono times line up in columns. |
| B · Gallery | Bricolage Grotesque | Warm, a little hand-made. Suits a community. |
| C · Schedule | Archivo (condensed widths) | Reads like a tournament program; times feel like a run sheet. |

Shared scale (the display face takes Display through H2):

| Step | Size / line-height | Weight | Use |
|---|---|---|---|
| Display | 30–44 / 1.1 | 700–800 | Game day title |
| H1 | 22 / 28 | 700 | Page title |
| H2 | 17 / 24 | 650 | Card and section headings, game names |
| Body | 15 / 22 | 400 | Notes, descriptions |
| Small | 13 / 18 | 500 | Meta lines, host, seats |
| Label | 12 / 16 | 600 | Section labels (sentence case, not all caps) |

Seats, times and counts use `tabular-nums`.

---

## 3. Spacing and shape

4px base: `4 · 8 · 12 · 16 · 20 · 24 · 32 · 48`. Card padding is 16–20px.
Content width tops out at 1240px. **Targets are at least 34px** (38px for
primary actions). Radius: 10px for controls, 14px for rows, 18px for cards
and modals, and pills fully rounded.

Two shadows, each with two parts (a tight contact edge plus a soft ambient
pool):

```
--shadow:    0 1px 2px rgba(0,0,0,.35), 0 10px 28px -12px rgba(0,0,0,.7)
--shadow-lg: 0 2px 4px rgba(0,0,0,.35), 0 24px 56px -20px rgba(0,0,0,.8)
```

`backdrop-filter` goes on exactly one surface, the sticky header. The current
page stacks a radial wash and two diagonal red gradients on top of that.
Keep at most the one wash.

---

## 4. Components

### Buttons

Primary (red fill), secondary (`--s2` with a border), quiet (no chrome), and
danger (quiet, red text). **One primary per view.** Every button has rest,
hover, `:focus-visible` (2px `--accent-text` ring) and disabled states.

### Join state machine

This behavior already exists in `applyJoinLeaveState`. The redesign changes
how it looks, not what it does.

| Viewer | Shows |
|---|---|
| Signed out | **Sign in to join** (enabled; it opens sign-in) |
| Not on the table | **Join**, or **Join waitlist** when full. Then the "Who's coming?" dialog (Just me / +1 / +2 / +3), skipped for custom sign-ups. |
| On the table | **Joined** (disabled, green) + **Leave** |
| Host | Leave deletes the table, so it shows as **Delete** next to **Edit** |
| Past event | No actions, read-only |

The "Table full — Join adds you to the waitlist" note gets folded into the
button label.

### Seats

One dot per chair, filled green as people join. Waitlisted people are gold
dots after a short gap. The count sits beside the dots: `3/5 seats · 2
waiting`. Above 12 seats the dots become a bar, as they do today.

### Roster

Two groups, Confirmed and Waitlist (Sign-ups for custom entries), each with
a count. Names are chips with an initial avatar. The viewer's own chip is red
text with "(you)", and party guests show as a gold `+1`. In tight layouts,
collapse the list to an avatar stack.

### Icons

Use a stroke icon set: inline SVG, 16px, 1.6px stroke, `currentColor`. **No
emoji.** Today the app uses emoji as its icon system: 📅 📍 👤 🎲 📚 🙋 🔗 📋 🔔
✏️ 📖. They render differently on every platform, can't take a color, and are
the loudest "generated" tell in the UI.

### Navigation and account

Nav is quiet text with an active indicator, not bordered, shadowed boxes.
Nickname, Profile & events, Host guide, Request organizer access and Sign
out go into one avatar menu. The inbox bell stays on its own, since it
carries unread state.

### Feedback

Toasts are inverted (light card, dark text), sit at the bottom center, and
clear after about 3 seconds. Confirmations are dialogs, never
`window.confirm`. Each list designs three states: loading (a skeleton that
matches the row shape), empty (one line plus the action that fixes it), and
filled.

---

## 5. Imagery

- **Logo:** the die-wolf mark, placed directly on the dark surface. Its black
  linework is meant to disappear into the background. Never redraw it or
  recolor it.
- **Box art** from BoardGameGeek is the app's best visual asset, and the
  current small thumbnails waste it. Covers use a fixed aspect box,
  `object-fit: cover`, and a 1px inner highlight so dark art doesn't bleed
  into a dark card. A game with no art gets an `--s2` tile with the dice glyph.
- No stock photos, no illustration, no gradient text.
