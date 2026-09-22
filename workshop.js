#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");

const root = __dirname;
const projectDir = path.join(root, "project");
const logFile = path.join(root, "log.txt");
const divider = "=".repeat(68);

const agents = {
  freebuff: ["freebuff"],
  gemini: ["gemini", "-p"],
  claude: ["claude", "-p"],
  codex: ["codex", "exec"],
  aider: ["aider", "--message"],
  opencode: ["opencode", "run"]
};

const secretPatterns = [
  [/\b(?:sk|sk-proj)-[A-Za-z0-9_-]{16,}\b/g, "[REDACTED_KEY]"],
  [/\bAIza[A-Za-z0-9_-]{20,}\b/g, "[REDACTED_KEY]"],
  [/\bgh[pousr]_[A-Za-z0-9]{20,}\b/g, "[REDACTED_TOKEN]"],
  [/(password|secret|api[_-]?key|token)\s*[:=]\s*[^\s,;]+/gi, "$1=[REDACTED]"]
];

function redact(value) {
  return secretPatterns.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), String(value));
}

function installed(command) {
  const checker = process.platform === "win32" ? "where" : "which";
  return spawnSync(checker, [command], { stdio: "ignore" }).status === 0;
}

function detectAgent(requested) {
  if (requested) {
    if (!agents[requested]) throw new Error(`Unsupported agent: ${requested}`);
    if (!installed(agents[requested][0])) throw new Error(`${requested} is not installed.`);
    return requested;
  }

  return Object.keys(agents).find((name) => installed(agents[name][0]));
}

function append(lines) {
  fs.appendFileSync(logFile, `${divider}\n${lines.join("\n")}\n${divider}\n\n`, "utf8");
}

function logPrompt(id, agent, prompt) {
  append([
    "PROMPT TO PRODUCT — WORKSHOP JOURNAL",
    `ID: ${id}`,
    `Time: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`,
    `Agent: ${agent}`,
    "",
    "Prompt:",
    redact(prompt)
  ]);
}

function logResult(id, status, duration) {
  append([
    "BUILD RESULT",
    `ID: ${id}`,
    `Status: ${status}`,
    `Duration: ${Math.round(duration / 1000)} seconds`
  ]);
}

function report() {
  const content = fs.existsSync(logFile) ? fs.readFileSync(logFile, "utf8") : "";
  const prompts = (content.match(/PROMPT TO PRODUCT — WORKSHOP JOURNAL/g) || []).length;
  const completed = (content.match(/Status: completed/g) || []).length;
  const failed = (content.match(/Status: failed/g) || []).length;
  console.log(`Prompts: ${prompts}\nCompleted: ${completed}\nFailed: ${failed}`);
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes("--report")) return report();

  const dryRun = args.includes("--dry-run");
  const agentOption = args.find((arg) => arg.startsWith("--agent="));
  const requestedAgent = agentOption?.split("=")[1] || process.env.PTP_AGENT;
  const prompt = args.filter((arg) => arg !== "--dry-run" && !arg.startsWith("--agent=")).join(" ").trim();

  if (!prompt) throw new Error('Add a prompt: npm run build -- "Build my portfolio"');

  const agent = detectAgent(requestedAgent);
  if (!agent) throw new Error("No supported AI coding agent found. Install FreeBuff, Gemini, Claude, Codex, Aider, or OpenCode.");

  fs.mkdirSync(projectDir, { recursive: true });
  const id = crypto.randomUUID().slice(0, 8);
  logPrompt(id, agent, prompt);
  console.log(`Using ${agent}. Prompt saved to log.txt.`);

  const [command, ...baseArgs] = agents[agent];
  if (dryRun) {
    console.log(`Dry run: ${command} ${[...baseArgs, prompt].join(" ")}`);
    return;
  }

  const started = Date.now();
  const result = spawnSync(command, [...baseArgs, prompt], {
    cwd: projectDir,
    stdio: "inherit",
    shell: false
  });
  const status = result.status === 0 ? "completed" : "failed";
  logResult(id, status, Date.now() - started);
  process.exitCode = result.status ?? 1;
}

try {
  main();
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
}
