#!/usr/bin/env node

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => { input += chunk; });
process.stdin.on("end", () => {
  try {
    const payload = JSON.parse(input || "{}");
    const prompt = payload.prompt || payload.user_prompt || payload.message;
    if (!prompt) process.exit(0);
    process.argv = [
      process.execPath,
      require.resolve("../src/cli"),
      "log",
      "--agent",
      "claude",
      "--prompt",
      String(prompt)
    ];
    require("../src/cli");
  } catch {
    process.exit(0);
  }
});
