# Prompt to Product

An AI-powered project-building workshop series by Alta Tech Club.

In this workshop, you will turn an idea into a working product using an AI coding agent. Session 01 focuses on building and deploying your personal portfolio.

## Setup

```bash
git clone https://github.com/sahilmane69/prompt-to-product.git
cd prompt-to-product
npm install
```

Install any one supported coding agent: FreeBuff, Gemini CLI, Claude Code, Codex, Aider, or OpenCode.

## Build

```bash
npm run build -- "Build a responsive personal portfolio"
```

The tool automatically selects an installed coding agent and detects your name from git/system config. Your project is created inside `project/`, and your workshop progress is saved in `log.txt`.

To specify your name or select an agent:

```bash
npm run build -- --user="Alex Morgan" --agent=gemini "Build a responsive personal portfolio"
```

You can also set the `PTP_USER` environment variable in your terminal (`export PTP_USER="Alex Morgan"`).

## AI Agent Control (`AGENTS.md`)

Workshop constraints and coding standards are defined in [`AGENTS.md`](file:///Users/sahilmane/Documents/GitHub/prompt-to-product/AGENTS.md). All supported AI agents (Claude, Gemini, Cursor, Codex, etc.) automatically follow these rules:
- Code generation stays strictly isolated within `project/`.
- Workshop runner scripts and logs remain protected.
- Generated code must follow high quality, responsive design, and educational commenting standards.

## Continue building

Run the same command with your next requirement:

```bash
npm run build -- "Add an About section and Projects section"
```

## View progress

```bash
npm run report
```

## Workshop flow

1. Describe what you want to build.
2. Run the build command.
3. Open and test the files inside `project/`.
4. Improve your prompt and build the next feature.
5. Commit and push meaningful progress to GitHub.

Never include passwords, API keys, tokens, or personal information in a prompt.
