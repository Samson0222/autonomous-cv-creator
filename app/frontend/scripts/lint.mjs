import { resolve } from "node:path"
import { ESLint } from "eslint"

const frontendRoot = resolve(import.meta.dirname, "..")
const repoRoot = resolve(frontendRoot, "../..")

/**
 * ESLint resolves files relative to the config file (app/frontend), which
 * leaves the shared tests in tests/frontend outside the lint base path. Run
 * the API from the repository root with an explicit config so both owned
 * frontend paths are covered without adding a root-level config file.
 */
const eslint = new ESLint({
  cwd: repoRoot,
  overrideConfigFile: resolve(frontendRoot, "eslint.config.js"),
})

const results = await eslint.lintFiles([
  "app/frontend/src",
  "app/frontend/vite.config.ts",
  "app/frontend/vitest.config.ts",
  "tests/frontend",
])

const formatter = await eslint.loadFormatter("stylish")
const output = formatter.format(results)

if (output) {
  process.stdout.write(output)
}

const errors = results.reduce((total, result) => total + result.errorCount, 0)
const warnings = results.reduce(
  (total, result) => total + result.warningCount,
  0
)

if (errors > 0) {
  process.exitCode = 1
} else {
  console.log(
    `Lint passed: ${results.length} files checked, ${warnings} warnings.`
  )
}
