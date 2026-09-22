const fs = require("node:fs");
const crypto = require("node:crypto");
const os = require("node:os");
const { redact } = require("./redact");

function createInteractionId() {
  return crypto.randomUUID();
}

function appendEvent(logFile, event) {
  const record = {
    schema_version: 1,
    timestamp: new Date().toISOString(),
    ...event
  };

  fs.appendFileSync(logFile, `${JSON.stringify(record)}${os.EOL}`, { encoding: "utf8", mode: 0o600 });
  return record;
}

function logPrompt(logFile, data) {
  return appendEvent(logFile, {
    event: "prompt",
    interaction_id: data.interactionId,
    project: redact(data.project),
    session: redact(data.session),
    student_id: redact(data.studentId),
    agent: data.agent.name,
    agent_detection: data.agent.source,
    prompt: redact(data.prompt)
  });
}

function logResult(logFile, data) {
  return appendEvent(logFile, {
    event: "result",
    interaction_id: data.interactionId,
    project: redact(data.project),
    session: redact(data.session),
    agent: data.agent,
    status: data.status,
    exit_code: data.exitCode,
    duration_ms: data.durationMs
  });
}

function readEvents(logFile) {
  if (!fs.existsSync(logFile)) return [];
  return fs.readFileSync(logFile, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

module.exports = { createInteractionId, logPrompt, logResult, readEvents };
