const { spawnSync } = require("node:child_process");

const agents = {
  claude: { command: "claude", args: ["-p", "{prompt}"] },
  codex: { command: "codex", args: ["exec", "{prompt}"] },
  gemini: { command: "gemini", args: ["-p", "{prompt}"] },
  freebuff: { command: "freebuff", args: ["{prompt}"] },
  aider: { command: "aider", args: ["--message", "{prompt}"] },
  opencode: { command: "opencode", args: ["run", "{prompt}"] }
};

function commandExists(command) {
  const checker = process.platform === "win32" ? "where" : "which";
  return spawnSync(checker, [command], { stdio: "ignore" }).status === 0;
}

function detectAgent(requested = "auto") {
  if (requested !== "auto") {
    if (!agents[requested]) throw new Error(`Unsupported agent: ${requested}`);
    return { name: requested, source: "explicit", installed: commandExists(agents[requested].command) };
  }

  const envChecks = [
    ["CLAUDE_CODE", "claude"],
    ["CODEX_HOME", "codex"],
    ["GEMINI_CLI", "gemini"],
    ["FREEBUFF_HOME", "freebuff"]
  ];

  for (const [key, name] of envChecks) {
    if (process.env[key]) return { name, source: `env:${key}`, installed: commandExists(agents[name].command) };
  }

  for (const name of Object.keys(agents)) {
    if (commandExists(agents[name].command)) return { name, source: "path", installed: true };
  }

  return { name: "unknown", source: "none", installed: false };
}

function buildCommand(agent, prompt) {
  const adapter = agents[agent];
  if (!adapter) throw new Error(`No runner configured for agent: ${agent}`);
  return {
    command: adapter.command,
    args: adapter.args.map((value) => value === "{prompt}" ? prompt : value)
  };
}

module.exports = { agents, detectAgent, buildCommand };
