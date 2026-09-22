const { readEvents } = require("./logger");

function buildReport(logFile) {
  const events = readEvents(logFile);
  const prompts = events.filter((event) => event.event === "prompt");
  const results = events.filter((event) => event.event === "result");
  const byAgent = {};
  const byProject = {};

  for (const event of prompts) {
    byAgent[event.agent] = (byAgent[event.agent] || 0) + 1;
    byProject[event.project] = (byProject[event.project] || 0) + 1;
  }

  return {
    total_prompts: prompts.length,
    completed_runs: results.filter((event) => event.status === "completed").length,
    failed_runs: results.filter((event) => event.status === "failed").length,
    prompts_by_agent: byAgent,
    prompts_by_project: byProject
  };
}

module.exports = { buildReport };
