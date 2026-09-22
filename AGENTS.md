# Prompt to Product workspace instructions

This repository is the shared workspace for the Prompt to Product workshop series.

Before making a code change, ensure the student's request has been recorded with:

```bash
npm run log -- --agent <agent-name> --prompt "<student request>"
```

Never write API keys, tokens, passwords, cookies, `.env` contents, or full model responses to `log.txt`.
Use `npm run ask -- ...` whenever possible so the workshop journal stays complete.

Keep generated project work inside `projects/<project-name>/`.
Run `npm test` before committing changes to the logger.
