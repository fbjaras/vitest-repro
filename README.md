# Vitest Repro

Minimal repro for Vitest resolution issue

To run the repro, run:

1. `npm install`
2. `npm run repro`
   - This runs vitest on project-a with the --changed=HEAD~1 flag, meaning run tests for changes in the last commit.

Expected: Tests in `basic.test.ts` should run and pass.

Actual: Vitest crashes with:
`Error: Failed to load url /<path-to-repo>/vitest-repro/project-a/graphql ...`

## Notes

- The same happends with multiple projects and tests, but this is a minimal repro.
- It only happens when running with the `--changed` flag and no `forceRerunTriggers` files are edited (since this will skip the resolving of dependencies).
- The project must have and use a module indirectly or directly in a test file. The project then needs to have a directory with the same name in the project root.
  - For example `project-a/graphql` exists, and `graphql` is imported in `basic.ts` which is tested in `basic.test.ts`.

## Root cause

The issue seems to be down to how Vitest resolves dependencies when running with `--changed`.
In [getTestDependencies](https://github.com/vitest-dev/vitest/blob/main/packages/vitest/src/node/specifications.ts#L189) dependent files are recursively found and "external dependencies" are filtered out by adding the module name/path to the project root path and then checking with `existsSync(fsPath))` if the path exists. This means that if the folder exists, it will be treated as local filepath and not an external dependency.
