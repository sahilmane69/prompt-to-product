#!/usr/bin/env node

const { spawnSync } = require("node:child_process");
const config = require("./config");
const { parseArgs } = require("./args");
const { detectAgent, buildCommand, agents } = require("./agents");
const { createInteractionId, logPrompt, logResult } = require("./logger");
const { buildReport } = require("./report");

const help = `
Prompt to Product Agent Logger

Commands:
  ptp ask --agent <name> --prompt <text> [--project <name>] [--session <name>] [--dry-run]
  ptp log --agent <name> --prompt <text> [--project <name>] [--session <name>]
  ptp detect [--agent auto]
  ptp report

Agents: ${Object.keys(agents).join(", ")}
`;

function required(args, name) {
  if (!args[name]) throw new Error(`Missing required option: --${name}`);
  return args[name];
}

function context(args) {
  return {
    project: args.project || config.project,
    session: args.session || config.session,
    studentId: args.student || config.studentId
  };
}

function main() {
  const [command = "help", ...rest] = process.argv.slice(2);
  const args = parseArgs(rest);

  if (command === "help" || args.help) {
    process.stdout.write(help);
    return;
  }

  if (command === "detect") {
    console.log(JSON.stringify(detectAgent(args.agent || "auto"), null, 2));
    return;
  }

  if (command === "report") {
    console.log(JSON.stringify(buildReport(config.logFile), null, 2));
    return;
  }

  if (command !== "ask" && command !== "log") throw new Error(`Unknown command: ${command}`);

  const prompt = required(args, "prompt");
  const agent = detectAgent(args.agent || "auto");
  const interactionId = createInteractionId();
  const ctx = context(args);

  logPrompt(config.logFile, { interactionId, prompt, agent, ...ctx });
  console.log(`Prompt logged: ${interactionId}`);

  if (command === "log") return;
  if (agent.name === "unknown") throw new Error("No supported agent detected. Pass --agent <name> after installing its CLI.");

  const runner = buildCommand(agent.name, prompt);
  if (args["dry-run"]) {
    console.log(JSON.stringify({ agent, command: runner.command, args: runner.args }, null, 2));
    return;
  }
  if (!agent.installed) throw new Error(`${runner.command} is not installed or is not available in PATH.`);

  const startedAt = Date.now();
  const result = spawnSync(runner.command, runner.args, { stdio: "inherit", shell: false });
  const exitCode = result.status ?? 1;
  logResult(config.logFile, {
    interactionId,
    project: ctx.project,
    session: ctx.session,
    agent: agent.name,
    status: exitCode === 0 ? "completed" : "failed",
    exitCode,
    durationMs: Date.now() - startedAt
  });
  process.exitCode = exitCode;
}

try {
  main();
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
}
