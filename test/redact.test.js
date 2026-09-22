const test = require("node:test");
const assert = require("node:assert/strict");
const { redact } = require("../src/redact");

test("redacts common secrets", () => {
  assert.equal(redact("api_key=super-secret-value"), "api_key=[REDACTED]");
  assert.equal(redact("password: hunter2"), "password=[REDACTED]");
  assert.match(redact("Bearer abcdefghijklmnopqrstuvwxyz"), /REDACTED/);
});

test("keeps ordinary prompts unchanged", () => {
  assert.equal(redact("Build a responsive portfolio"), "Build a responsive portfolio");
});
