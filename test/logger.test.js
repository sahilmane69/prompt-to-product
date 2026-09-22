const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { logPrompt, logResult, readEvents } = require("../src/logger");

test("writes linked prompt and result events", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "ptp-"));
  const logFile = path.join(directory, "log.txt");
  const interactionId = "test-id";

  logPrompt(logFile, {
    interactionId,
    project: "portfolio",
    session: "session-01",
    studentId: "student-1",
    agent: { name: "gemini", source: "explicit" },
    prompt: "Build a hero section"
  });
  logResult(logFile, {
    interactionId,
    project: "portfolio",
    session: "session-01",
    agent: "gemini",
    status: "completed",
    exitCode: 0,
    durationMs: 20
  });

  const events = readEvents(logFile);
  assert.equal(events.length, 2);
  assert.equal(events[0].prompt, "Build a hero section");
  assert.equal(events[1].interaction_id, interactionId);
});
