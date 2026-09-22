function parseArgs(argv) {
  const result = { _: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (!value.startsWith("--")) {
      result._.push(value);
      continue;
    }
    const key = value.slice(2);
    if (key === "dry-run" || key === "help") {
      result[key] = true;
      continue;
    }
    result[key] = argv[index + 1];
    index += 1;
  }
  return result;
}

module.exports = { parseArgs };
