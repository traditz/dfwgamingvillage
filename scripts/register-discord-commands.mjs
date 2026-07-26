/*
 * One-time registration of the DFWGV librarian bot's slash commands.
 *
 * PowerShell:
 *   $env:DISCORD_APP_ID = "your application id"
 *   $env:DISCORD_BOT_TOKEN = "your bot token"
 *   node scripts/register-discord-commands.mjs
 *
 * The bot token is used only for this call and never stored. Re-run any time
 * the command definitions change (registration is a bulk overwrite).
 */
const APP_ID = process.env.DISCORD_APP_ID;
const TOKEN = process.env.DISCORD_BOT_TOKEN;
if (!APP_ID || !TOKEN) {
  console.error('Set DISCORD_APP_ID and DISCORD_BOT_TOKEN environment variables first.');
  process.exit(1);
}

const commands = [
  {
    name: 'gamenight',
    description: 'Get 3 game recommendations from the DFWGV library',
    options: [
      { type: 4, name: 'players', description: 'How many players?', required: true, min_value: 1, max_value: 20 },
      { type: 4, name: 'minutes', description: 'Roughly how long do you have? (minutes)', required: false, min_value: 10, max_value: 480 },
      { type: 3, name: 'vibe', description: 'e.g. light party, heavy strategy, co-op, something like Catan', required: false, max_length: 200 }
    ]
  }
];

const res = await fetch(`https://discord.com/api/v10/applications/${APP_ID}/commands`, {
  method: 'PUT',
  headers: { Authorization: `Bot ${TOKEN}`, 'Content-Type': 'application/json' },
  body: JSON.stringify(commands)
});
if (!res.ok) {
  console.error(`Discord ${res.status}: ${await res.text()}`);
  process.exit(1);
}
const registered = await res.json();
console.log(`Registered ${registered.length} command(s): ${registered.map((c) => '/' + c.name).join(', ')}`);
console.log('They can take a few minutes to appear in your server.');
