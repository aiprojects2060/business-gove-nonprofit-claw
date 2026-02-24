# BROADCAST_RULES.md

## Cross-Agent Learning Broadcast Rules

When one agent logs a learning tagged with an Area, broadcast to interested agents.

- Area: executive-ceo → interested: [executive-coo, executive-cfo, executive-cto]
- Area: operations → interested: [facilities, pmo, security]
- Area: hr → interested: [training, executive-coo]

## How It Works
1. Agent logs a learning to `.learnings/LEARNINGS.md` with an `Area:` tag
2. If the Area matches a broadcast rule, relevant agents are notified
3. Receiving agents can then update their own knowledge or respond

## Custom Rules
Add area-to-agent mappings below as your organization evolves:

