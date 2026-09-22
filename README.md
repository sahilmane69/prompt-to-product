# Prompt to Product

Welcome to **Prompt to Product**, an AI-powered project-building workshop series by Alta Tech Club.

This repository is your workspace for learning how to turn an idea into a working product with modern AI coding tools. Each session focuses on building something practical from scratch.

## Series projects

### Session 01 — Personal Portfolio

Build and customize a responsive portfolio website that presents your skills, projects, experience, and contact information.

### Session 02 — E-commerce Website

Build a modern shopping experience with product listings, search, cart interactions, and a responsive interface.

## What you will learn

- Converting an idea into clear requirements
- Writing effective prompts for development tasks
- Building features step by step with an AI coding agent
- Reading and improving generated code
- Testing, debugging, and refining a project
- Using Git and GitHub to manage your work
- Deploying a finished project

## Repository structure

```text
projects/
├── portfolio/       # Session 01 project
└── ecommerce/       # Session 02 project

log.txt              # Your readable workshop journal
```

## Setup

Node.js 18 or newer is required.

```bash
npm install
npm link
cp .env.example .env
```

## Start building

Choose the agent available on your system and run your task:

```bash
ptp ask --agent gemini --project portfolio --session session-01 --prompt "Build a responsive portfolio hero section"
```

Other supported options include `claude`, `codex`, `freebuff`, `aider`, and `opencode`.

If you only want to add an idea to your workshop journal:

```bash
ptp log --agent gemini --project portfolio --session session-01 --prompt "Add a projects section"
```

## Workshop journal

Your prompts and project progress are organized inside `log.txt` in a clean format:

```text
========================================================================
PROMPT TO PRODUCT — WORKSHOP JOURNAL
Type: PROMPT
ID: 2f6a...
Time: 2026-09-22T12:00:00.000Z
Project: portfolio
Session: session-01
Student: anonymous
Agent: gemini
Detected via: explicit

Prompt:
Build a responsive portfolio hero section
========================================================================
```

Never include passwords, API keys, tokens, or personal information in a prompt.

## Useful commands

```bash
ptp detect
ptp report
npm test
```

## Workshop workflow

1. Understand the feature you want to build.
2. Write a clear and specific prompt.
3. Generate the first version.
4. Read and test the result.
5. Improve the prompt and iterate.
6. Commit each meaningful milestone to GitHub.

Build thoughtfully. Understand your code. Ship a product you can explain.
