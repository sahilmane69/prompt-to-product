const fs = require("node:fs");
const crypto = require("node:crypto");
const os = require("node:os");
const { redact } = require("./redact");

function createInteractionId() {
  return crypto.randomUUID();
}

const divider = "=".repeat(72);

function appendBlock(logFile, lines) {
  const content = `${divider}${os.EOL}${lines.join(os.EOL)}${os.EOL}${divider}${os.EOL}${os.EOL}`;
  fs.appendFileSync(logFile, content, { encoding: "utf8", mode: 0o600 });
}

function logPrompt(logFile, data) {
  const record = {
    event: "prompt",
    timestamp: new Date().toISOString(),
    interaction_id: data.interactionId,
    project: redact(data.project),
    session: redact(data.session),
    student_id: redact(data.studentId),
    agent: data.agent.name,
    agent_detection: data.agent.source,
    prompt: redact(data.prompt)
  };

  appendBlock(logFile, [
    "PROMPT TO PRODUCT — WORKSHOP JOURNAL",
    "Type: PROMPT",
    `ID: ${record.interaction_id}`,
    `Time: ${record.timestamp}`,
    `Project: ${record.project}`,
    `Session: ${record.session}`,
    `Student: ${record.student_id}`,
    `Agent: ${record.agent}`,
    `Detected via: ${record.agent_detection}`,
    "",
    "Prompt:",
    record.prompt
  ]);
  return record;
}

function logResult(logFile, data) {
  const record = {
    event: "result",
    timestamp: new Date().toISOString(),
    interaction_id: data.interactionId,
    project: redact(data.project),
    session: redact(data.session),
    agent: data.agent,
    status: data.status,
    exit_code: data.exitCode,
    duration_ms: data.durationMs
  };

  appendBlock(logFile, [
    "PROMPT TO PRODUCT — WORKSHOP JOURNAL",
    "Type: RESULT",
    `ID: ${record.interaction_id}`,
    `Time: ${record.timestamp}`,
    `Project: ${record.project}`,
    `Session: ${record.session}`,
    `Agent: ${record.agent}`,
    `Status: ${record.status}`,
    `Exit code: ${record.exit_code}`,
    `Duration: ${record.duration_ms} ms`
  ]);
  return record;
}

function readEvents(logFile) {
  if (!fs.existsSync(logFile)) return [];
  return fs.readFileSync(logFile, "utf8")
    .split(divider)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block.split(/\r?\n/);
      const value = (label) => lines.find((line) => line.startsWith(`${label}: `))?.slice(label.length + 2);
      const type = value("Type")?.toLowerCase();
      const event = {
        event: type,
        interaction_id: value("ID"),
        timestamp: value("Time"),
        project: value("Project"),
        session: value("Session"),
        agent: value("Agent")
      };

      if (type === "prompt") {
        const promptIndex = lines.indexOf("Prompt:");
        event.student_id = value("Student");
        event.agent_detection = value("Detected via");
        event.prompt = promptIndex >= 0 ? lines.slice(promptIndex + 1).join(os.EOL).trim() : "";
      }

      if (type === "result") {
        event.status = value("Status");
        event.exit_code = Number(value("Exit code"));
        event.duration_ms = Number(value("Duration")?.replace(" ms", ""));
      }
      return event;
    });
}

module.exports = { createInteractionId, logPrompt, logResult, readEvents };
