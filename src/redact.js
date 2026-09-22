const patterns = [
  [/\b(?:sk|sk-proj)-[A-Za-z0-9_-]{16,}\b/g, "[REDACTED_OPENAI_KEY]"],
  [/\bAIza[A-Za-z0-9_-]{20,}\b/g, "[REDACTED_GOOGLE_KEY]"],
  [/\bgh[pousr]_[A-Za-z0-9]{20,}\b/g, "[REDACTED_GITHUB_TOKEN]"],
  [/\b(?:Bearer\s+)[A-Za-z0-9._~-]{16,}\b/gi, "Bearer [REDACTED_TOKEN]"],
  [/(password|passwd|secret|api[_-]?key|token)\s*[:=]\s*[^\s,;]+/gi, "$1=[REDACTED]"]
];

function redact(value) {
  return patterns.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), String(value));
}

module.exports = { redact };
