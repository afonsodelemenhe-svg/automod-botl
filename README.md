# automod-botl

A small Discord moderation bot starter built with Node.js and discord.js. It currently provides `/ping` and a permission-checked `/purge` command for deleting 2–100 recent messages.

## Requirements

- Node.js 20 or newer
- A Discord application and bot created in the [Discord Developer Portal](https://discord.com/developers/applications)

## Setup

1. Install dependencies: `npm install`.
2. Copy `.env.example` to `.env` and fill in `BOT_TOKEN` and `CLIENT_ID`. For development, set `GUILD_ID` to your test server ID; guild commands update faster. Leave it blank to register commands globally.
3. In the Developer Portal, invite the bot to your server with the `bot` and `applications.commands` scopes. Grant only the permissions it needs; `/purge` requires **Manage Messages** for both the invoking member and the bot.
4. Register slash commands: `npm run deploy-commands`.
5. Start the bot: `npm start`.

Keep your real bot token out of source control. If it is exposed, reset it in the Developer Portal immediately. The bot only requests the `Guilds` gateway intent; message content intent is not needed for these slash commands.

## Commands

- `/ping` — replies with `Pong!`.
- `/purge amount:<2–100>` — removes recent messages in the current text channel. Discord does not allow bulk deletion of messages older than 14 days, so those are skipped.
