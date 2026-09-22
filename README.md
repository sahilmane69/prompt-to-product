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

The tool automatically selects an installed coding agent. Your project is created inside `project/`, and your workshop progress is saved in `log.txt`.

To choose a specific installed agent:

```bash
npm run build -- --agent=gemini "Build a responsive personal portfolio"
```

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
