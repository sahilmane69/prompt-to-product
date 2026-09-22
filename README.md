# Prompt to Product

An AI-powered project-building series with automatic prompt logging and coding-agent detection.

Students use one common runner to work with Claude Code, Codex, Gemini CLI, FreeBuff, Aider, or OpenCode. Every prompt is appended to `log.txt` with the selected agent, project, session, timestamp, and interaction ID. Completed CLI runs also record duration and exit status.

## Why the runner is required

There is no universal operating-system API that can read prompts typed inside every AI editor or website. This repository solves that reliably by routing supported coding agents through one command. Claude Code additionally has a repository hook for automatic prompt capture.

## Structure

```text
.
├── .claude/settings.json       # Claude Code prompt hook
├── hooks/                      # Native agent integrations
├── projects/
│   ├── portfolio/              # Session 01 project
│   └── ecommerce/              # Session 02 project
├── src/
│   ├── agents.js               # Agent adapters and detection
│   ├── cli.js                  # Common runner
│   ├── logger.js               # Append-only JSONL logging
│   ├── redact.js               # Secret protection
│   └── report.js               # Usage summary
├── test/
├── AGENTS.md                   # Instructions for coding agents
└── log.txt                     # Prompt and run events
```

## Setup

Node.js 18 or newer is required.

```bash
npm install
npm link
cp .env.example .env
```

No npm dependencies are required.

## Use

Run a prompt with an installed agent:

```bash
ptp ask --agent gemini --project portfolio --session session-01 --prompt "Build a responsive portfolio hero section"
```

```bash
ptp ask --agent claude --project ecommerce --session session-02 --prompt "Create a responsive product grid"
```

Detect an installed agent automatically:

```bash
ptp detect
```

Record a prompt without launching an agent:

```bash
ptp log --agent codex --project portfolio --prompt "Add a projects section"
```

Preview the command without executing it:

```bash
ptp ask --agent gemini --prompt "Create a navbar" --dry-run
```

View usage totals:

```bash
ptp report
```

## Log format

`log.txt` is newline-delimited JSON. Each interaction has a shared `interaction_id`.

```json
{"schema_version":1,"timestamp":"2026-09-22T12:00:00.000Z","event":"prompt","interaction_id":"...","project":"portfolio","session":"session-01","student_id":"anonymous","agent":"gemini","agent_detection":"explicit","prompt":"Build a responsive portfolio"}
{"schema_version":1,"timestamp":"2026-09-22T12:00:08.000Z","event":"result","interaction_id":"...","project":"portfolio","session":"session-01","agent":"gemini","status":"completed","exit_code":0,"duration_ms":8000}
```

API keys, tokens, passwords, and common secrets are redacted before writing. Model responses are not stored by default.

## Supported agents

| Agent | Command used |
| --- | --- |
| Claude Code | `claude -p` |
| Codex | `codex exec` |
| Gemini CLI | `gemini -p` |
| FreeBuff | `freebuff` |
| Aider | `aider --message` |
| OpenCode | `opencode run` |

Adapters can be changed in `src/agents.js` if a CLI syntax changes.

## Verify

```bash
npm test
node src/cli.js ask --agent gemini --prompt "Test prompt" --dry-run
node src/cli.js report
```

## GitHub

Create an empty repository, then run:

```bash
git init
git add .
git commit -m "feat: initialize Prompt to Product agent logger"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/prompt-to-product.git
git push -u origin main
```

## Privacy

- Tell participants that prompts are logged before the workshop begins.
- Never include credentials or personal data in prompts.
- Keep the repository private if student identifiers are enabled.
- Set `PTP_STUDENT_ID=anonymous` unless identification is genuinely required.
