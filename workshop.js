#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const os = require("node:os");
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

function getGitUserName() {
  try {
    const res = spawnSync("git", ["config", "user.name"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    if (res.status === 0 && res.stdout) {
      const name = res.stdout.trim();
      if (name) return name;
    }
  } catch {}
  return null;
}

function resolveUser(explicitUser) {
  if (explicitUser && explicitUser.trim()) return explicitUser.trim();
  if (process.env.PTP_USER && process.env.PTP_USER.trim()) return process.env.PTP_USER.trim();
  if (process.env.PTP_STUDENT && process.env.PTP_STUDENT.trim()) return process.env.PTP_STUDENT.trim();
  const gitName = getGitUserName();
  if (gitName) return gitName;
  if (process.env.USER) return process.env.USER;
  if (process.env.USERNAME) return process.env.USERNAME;
  try {
    const username = os.userInfo()?.username;
    if (username) return username;
  } catch {}
  return "Participant";
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

function logPrompt(id, user, agent, prompt) {
  append([
    "PROMPT TO PRODUCT — WORKSHOP JOURNAL",
    `ID: ${id}`,
    `User: ${user}`,
    `Time: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`,
    `Agent: ${agent}`,
    "",
    "Prompt:",
    redact(prompt)
  ]);
}

function logResult(id, user, status, duration) {
  append([
    "BUILD RESULT",
    `ID: ${id}`,
    `User: ${user}`,
    `Status: ${status}`,
    `Duration: ${Math.round(duration / 1000)} seconds`
  ]);
}

function syncAgentInstructions() {
  const rootAgents = path.join(root, "AGENTS.md");
  const projectAgents = path.join(projectDir, "AGENTS.md");
  if (fs.existsSync(rootAgents) && !fs.existsSync(projectAgents)) {
    try {
      fs.symlinkSync(path.relative(projectDir, rootAgents), projectAgents);
    } catch {
      try {
        fs.copyFileSync(rootAgents, projectAgents);
      } catch {}
    }
  }
}

function report() {
  const content = fs.existsSync(logFile) ? fs.readFileSync(logFile, "utf8") : "";
  const prompts = (content.match(/PROMPT TO PRODUCT — WORKSHOP JOURNAL/g) || []).length;
  const completed = (content.match(/Status: completed/g) || []).length;
  const failed = (content.match(/Status: failed/g) || []).length;
  const users = [...new Set([...content.matchAll(/^User:\s*(.+)$/gm)].map((m) => m[1].trim()))];

  console.log(`Prompts: ${prompts}\nCompleted: ${completed}\nFailed: ${failed}`);
  if (users.length > 0) {
    console.log(`Users: ${users.join(", ")}`);
  }
}

function getAgentForLog(requestedAgent) {
  if (requestedAgent && requestedAgent.trim()) return requestedAgent.trim();
  const detected = Object.keys(agents).find((name) => installed(agents[name][0]));
  if (detected) return detected;
  return process.env.PTP_AGENT || "assistant";
}

function parseWorkshopArgs(argv) {
  let dryRun = false;
  let report = false;
  let log = false;
  let result = false;
  let id = null;
  let status = null;
  let duration = 0;
  let requestedAgent = process.env.PTP_AGENT || null;
  let explicitUser = null;
  const promptParts = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--report") {
      report = true;
    } else if (arg === "--dry-run") {
      dryRun = true;
    } else if (arg === "--log" || arg === "--log-only") {
      log = true;
    } else if (arg === "--result") {
      result = true;
    } else if (arg.startsWith("--id=")) {
      id = arg.slice("--id=".length);
    } else if (arg === "--id" && i + 1 < argv.length) {
      id = argv[++i];
    } else if (arg.startsWith("--status=")) {
      status = arg.slice("--status=".length);
    } else if (arg === "--status" && i + 1 < argv.length) {
      status = argv[++i];
    } else if (arg.startsWith("--duration=")) {
      duration = Number(arg.slice("--duration=".length)) || 0;
    } else if (arg === "--duration" && i + 1 < argv.length) {
      duration = Number(argv[++i]) || 0;
    } else if (arg.startsWith("--agent=")) {
      requestedAgent = arg.slice("--agent=".length);
    } else if (arg === "--agent" && i + 1 < argv.length) {
      requestedAgent = argv[++i];
    } else if (arg.startsWith("--user=")) {
      explicitUser = arg.slice("--user=".length);
    } else if (arg === "--user" && i + 1 < argv.length) {
      explicitUser = argv[++i];
    } else if (arg.startsWith("--name=")) {
      explicitUser = arg.slice("--name=".length);
    } else if (arg === "--name" && i + 1 < argv.length) {
      explicitUser = argv[++i];
    } else if (arg.startsWith("--student=")) {
      explicitUser = arg.slice("--student=".length);
    } else if (arg === "--student" && i + 1 < argv.length) {
      explicitUser = argv[++i];
    } else {
      promptParts.push(arg);
    }
  }

  return {
    dryRun,
    report,
    log,
    result,
    id,
    status,
    duration,
    requestedAgent,
    user: resolveUser(explicitUser),
    prompt: promptParts.join(" ").trim()
  };
}

function main() {
  const args = parseWorkshopArgs(process.argv.slice(2));
  if (args.report) return report();

  const { dryRun, log, result, id: specifiedId, status: specifiedStatus, duration, requestedAgent, user, prompt } = args;

  // Handle direct logging by AI agents (without spawning a subagent process)
  if (log) {
    if (result) {
      const interactionId = specifiedId || "manual";
      const status = specifiedStatus || "completed";
      logResult(interactionId, user, status, duration * 1000);
      console.log(`Result logged to log.txt [ID: ${interactionId}, Status: ${status}] for ${user}.`);
      return;
    }

    if (!prompt) throw new Error('Add a prompt to log: npm run log -- "Your prompt here"');
    const interactionId = specifiedId || crypto.randomUUID().slice(0, 8);
    const agent = getAgentForLog(requestedAgent);
    logPrompt(interactionId, user, agent, prompt);
    if (specifiedStatus) {
      logResult(interactionId, user, specifiedStatus, duration * 1000);
    }
    console.log(`Prompt logged to log.txt [ID: ${interactionId}] for ${user} (Agent: ${agent}).`);
    return;
  }

  if (!prompt) throw new Error('Add a prompt: npm run build -- "Build my portfolio"');

  const agent = detectAgent(requestedAgent);
  if (!agent) throw new Error("No supported AI coding agent found. Install FreeBuff, Gemini, Claude, Codex, Aider, or OpenCode.");

  fs.mkdirSync(projectDir, { recursive: true });
  syncAgentInstructions();
  const id = specifiedId || crypto.randomUUID().slice(0, 8);
  logPrompt(id, user, agent, prompt);
  console.log(`Using ${agent} for ${user}. Prompt saved to log.txt.`);

  const [command, ...baseArgs] = agents[agent];
  if (dryRun) {
    console.log(`Dry run: ${command} ${[...baseArgs, prompt].join(" ")}`);
    return;
  }

  const started = Date.now();
  const runner = spawnSync(command, [...baseArgs, prompt], {
    cwd: projectDir,
    stdio: "inherit",
    shell: false
  });
  const buildStatus = runner.status === 0 ? "completed" : "failed";
  logResult(id, user, buildStatus, Date.now() - started);
  process.exitCode = runner.status ?? 1;
}

try {
  main();
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
}
