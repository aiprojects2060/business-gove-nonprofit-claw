# 🏢 Business · Government · NonProfit Claw

> Multi-agent AI gateway for **business**, **government**, and **non-profit** organizations — orchestrate 100+ role-specific AI agents across chat, web, and messaging channels.

Built on [OpenClaw](https://github.com/openclaw/openclaw). MIT License.

---

## What is this?

A turnkey AI agent platform that scaffolds a full organizational workforce of AI agents — each with their own identity, persona, skills, and LLM model. Deploy it on your own infrastructure and chat with any agent through a unified gateway.

### Agent Categories

| Category | Examples |
|---|---|
| 🎯 **Executive** | CEO, COO, Chief of Staff |
| 💰 **Finance** | CFO, Accountant, Funding Agent |
| ⚖️ **Legal** | General Counsel, Contract Drafter |
| 📣 **Marketing** | CMO, Content Strategist |
| 🛒 **Sales** | Sales Director, CRM Manager |
| 👥 **HR** | HR Director, Recruiter |
| 🖥️ **IT** | CTO, DevOps, Cybersecurity |
| 📞 **Business Services** | Phone Handler, Live Chat, Appointments |
| 🧠 **Consulting** | Strategy, M&A, Operations, Finance |
| 🏛️ **Government** | US & UK government role agents |
| 🌍 **NGO / Non-Profit** | Director, Grant Writer, Advocacy |
| 🔧 **Support** | Help Desk, Customer Success |

Each agent has a full persona: `SOUL.md`, `IDENTITY.md`, `MISSION.md`, dedicated workspace, and configurable LLM model.

---

## Quick Start

### Prerequisites

- **Node.js ≥ 22** — [nodejs.org](https://nodejs.org/)
- **pnpm** — `npm install -g pnpm`
- **Git** — [git-scm.com](https://git-scm.com/)

Works on **Windows**, **macOS**, and **Linux**.

### Install

```bash
git clone https://github.com/aiprojects2060/business-gove-nonprofit-claw.git
cd business-gove-nonprofit-claw

pnpm install
pnpm build

# Run the onboarding wizard (sets up your agents + workspace)
pnpm openclaw onboard

# Start the gateway
pnpm openclaw gateway
```

The gateway dashboard will be available at **http://127.0.0.1:18789**

### Development Mode (auto-reload)

```bash
pnpm install
pnpm gateway:watch
```

---

## Chat Commands

Send these in the built-in chat, WhatsApp, Telegram, Slack, Discord, or any connected channel:

| Command | Description |
|---|---|
| `/agent` | List all agents grouped by category |
| `/agent <name>` | Search for a specific agent |
| `/status` | Current session status (model + tokens) |
| `/new` or `/reset` | Reset the session |
| `/compact` | Compact session context |
| `/help` | List all available commands |

---

## Channels

Connect your agents to the messaging platforms you already use:

- **WhatsApp** (Baileys)
- **Telegram** (grammY)
- **Slack** (Bolt)
- **Discord** (discord.js)
- **Google Chat**
- **Signal**
- **Microsoft Teams**
- **WebChat** (built-in)

Channel configuration: see [OpenClaw Docs — Channels](https://docs.openclaw.ai/channels)

---

## Configuration

Agent configuration lives in `~/.openclaw/openclaw.json`. Minimal setup:

```json5
{
  agent: {
    model: "anthropic/claude-opus-4-6",
  },
}
```

Full reference: [OpenClaw Configuration](https://docs.openclaw.ai/gateway/configuration)

---

## Architecture

```
WhatsApp / Telegram / Slack / Discord / WebChat / ...
               │
               ▼
┌───────────────────────────────┐
│            Gateway            │
│       (control plane)         │
│     ws://127.0.0.1:18789      │
└──────────────┬────────────────┘
               │
               ├─ 100+ AI Agents (per-agent sessions)
               ├─ WebChat UI
               ├─ CLI (openclaw …)
               └─ Control Dashboard
```

---

## Updating

```bash
cd business-gove-nonprofit-claw
git pull
pnpm install
pnpm build
```

---

## Upstream

This project is a fork of [OpenClaw](https://github.com/openclaw/openclaw) — a personal AI assistant platform by Peter Steinberger and the community. We build on their excellent foundation to provide pre-configured multi-agent setups for organizational use.

- [OpenClaw Website](https://openclaw.ai)
- [OpenClaw Docs](https://docs.openclaw.ai)
- [OpenClaw Discord](https://discord.gg/clawd)

---

## License

MIT — see [LICENSE](LICENSE)
