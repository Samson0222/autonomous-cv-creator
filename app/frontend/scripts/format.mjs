import { spawnSync } from "node:child_process"
import { createRequire } from "node:module"
import { resolve } from "node:path"

const require = createRequire(import.meta.url)
const prettierCli = require.resolve("prettier/bin/prettier.cjs")
const frontendRoot = resolve(import.meta.dirname, "..")

const toPosix = (value) => value.replaceAll("\\", "/")
const targets = [
  resolve(frontendRoot, "src/**/*.{ts,tsx}"),
  resolve(frontendRoot, "*.config.ts"),
  resolve(frontendRoot, "../../tests/frontend/**/*.{ts,tsx}"),
].map(toPosix)

const result = spawnSync(
  process.execPath,
  [
    prettierCli,
    "--write",
    "--config",
    resolve(frontendRoot, ".prettierrc"),
    ...targets,
  ],
  { stdio: "inherit" }
)

process.exitCode = result.status ?? 1
