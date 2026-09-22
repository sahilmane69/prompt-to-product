const path = require("node:path");

const root = path.resolve(__dirname, "..");

module.exports = {
  root,
  logFile: path.resolve(root, process.env.PTP_LOG_FILE || "log.txt"),
  project: process.env.PTP_PROJECT || "series",
  session: process.env.PTP_SESSION || "session-01",
  studentId: process.env.PTP_STUDENT_ID || "anonymous"
};
