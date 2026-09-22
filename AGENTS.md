# Prompt to Product agent instructions

This repository tracks AI-assisted development for learning and review.

Before making a code change, ensure the student's request has been recorded with:

```bash
npm run log -- --agent <agent-name> --prompt "<student request>"
```

Never write API keys, tokens, passwords, cookies, `.env` contents, or full model responses to `log.txt`.
Use `npm run ask -- ...` whenever possible because it records the prompt, detects the selected agent, runs it, and records the result automatically.

Keep generated project work inside `projects/<project-name>/`.
Run `npm test` before committing changes to the logger.
