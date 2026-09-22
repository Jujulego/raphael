---
name: discover-and-scaffold-stories-storybook-jetbrains
description: Analyse component props, audit story coverage, and generate missing Storybook stories with the storybook-connect CLI. Prefer reusable UI components (not pages/screens) unless the user asks otherwise. Use when checking which stories a component has or lacks, or when creating stories for components.
metadata:
  source: storybookjs/mcp
  installed-by: storybook-connect
---

# Storybook Connect CLI — analyse and generate stories

The Storybook Connect plugin adds a `storybook-connect` command to the WebStorm launcher. It uses the IDE's own TypeScript engine to answer
four questions about any component file — what props does it take, which stories could exist, which of those are missing, and can you write
them — without needing Storybook to be running. One further subcommand, `base-url`, answers about the project instead of about a component.

```
webstorm storybook-connect <subcommand> <component-file> --caller ai_agent [options]
webstorm storybook-connect base-url --caller ai_agent [--project <root>] [--text]
```

On Windows use `webstorm.bat` (from the WebStorm `bin` directory on `PATH`), not
`webstorm64.exe` — the batch launcher prints CLI output to the terminal the same way `webstorm` does on macOS/Linux.

When WebStorm is already running with the project open, the command is answered by the running IDE (fast, indexes warm) and relative paths
resolve against your shell. With no IDE running, a cold start opens the project first (slower) and **requires absolute paths** (both the
component file and `--project`).

**Sandboxed shells:** the `webstorm` launcher must enumerate system processes to find the running IDE. In a sandboxed agent shell that
blocks this, it dies before reaching the plugin with `Operation not permitted (sysctl failed)` and a JVM fatal-error dump. If you see that,
re-run the command outside the sandbox (e.g. request sandbox-exempt execution for this command) — it needs no other privileges.

## Subcommands

 Subcommand                    | Answers                                                                                                                                                                                                                                                                        |
-------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
 `component-props`             | The component's props with resolved types: kind (variant/boolean/string/number/color/date/function/array/node), optionality, defaults, JSDoc. Unsupported props (nested objects) are listed with a reason, never guessed.                                                      |
 `possible-stories`            | The non-combinatorial story plan: `Default` + one story per variant value + one per boolean (plus an explicit off story when a boolean defaults to `true`) + one story per other optional prop (color, function, string, …). One prop varies per story — never cross-products. |
 `missing-stories`             | The same plan diffed against the existing story file: which planned stories (including optional color/function/string/… stories) are covered and by which export, and which are still missing.                                                                                 |
 `create-story --story <Name>` | Writes one planned story — appends to the existing story file or scaffolds a fresh `.stories.tsx`. `--args '{"prop": value}'` overrides/adds arg values.                                                                                                                       |
 `create-story --props a,b`    | Writes every planned story whose varying prop is in the list (e.g. `--props size` → Small/Medium/Large). Cannot combine with `--story` or `--args`.                                                                                                                            |
 `create-missing-stories`      | Writes every missing planned story in one invocation (variants, booleans, and other optional props).                                                                                                                                                                           |
 `base-url`                    | The project's Storybook base URL, as the IDE has it right now. Takes no component file. Use it to build preview links — never assume an address or reuse one from an earlier session.                                                                                          |
 `help`                        | Prints usage.                                                                                                                                                                                                                                                                  |

## Options and contract

- `--json` (default) for machine-readable output; `--text` for humans. Errors are `{"error": "…"}` in JSON mode.
- `--component <Name>` when a file declares several components;
  `--project <root>` to override project-root detection (default: nearest
  `package.json` ancestor).
- `--props a,b` (comma-separated) filters by varying prop on
  `possible-stories`, `missing-stories`, `create-missing-stories`, and
  `create-story`. Selects planned stories whose `varyingProp` is listed — Default is never selected. Unknown prop names are an error.
- **`--caller ai_agent` on every invocation.** It tells the plugin's usage statistics that an agent ran the command rather than a person
  typing in a terminal, which is the only way the two can be told apart. Add
  `--caller-surface` when you know the product you are — `jetbrains_ai_assistant`
  or `codex` — and `other_agent` otherwise. Setting
  `STORYBOOK_CONNECT_CALLER=ai_agent` in the environment does the same thing for every invocation. Neither value changes what the command
  does.
- Exit codes: `0` success · `2` domain failure (unknown story, write failed) ·
  `3` project open failed · `64` usage error · `1` unexpected internal error.
  `missing-stories` exits `0` even for partial coverage — check the payload.
- **Windows:** use `webstorm.bat` (add WebStorm's `bin` to `PATH`) so the payload prints to the terminal like macOS/Linux. `webstorm64.exe`
  only relays the exit code. Every command also writes its payload to
  `%TEMP%\storybook-connect-cli-output.txt`.

## Recommended workflow

1. **Scope** — Work on reusable UI components only by default (see **Scope:
   components only** below). Defer pages/screens until the user opts in.
2. **Analyse** — `component-props <file> --json` to see what the component exposes and which props the planner can act on.
3. **Audit** — `missing-stories <file> --json`. Read two flags before trusting the result:
  - `"partial": true` means some existing exports could not be analyzed (spread args, function-based stories) — the missing list is
    best-effort, so verify against the story file before batch-creating.
  - a `"note"` about no story file being found means stories may live outside the sibling convention (`<Component>.stories.*` next to the
    component) — the report is wrong for such projects; do not scaffold a duplicate.
4. **Generate** — `create-missing-stories <file>` for the whole gap, or
   `create-story --story <Name>` for one (take names verbatim from the
   `missing-stories` output; `--args` values are plain JSON, not the rendered source expressions shown in the report).
5. **Enhance** — generated stories are deliberately minimal: `args` only, no
   `argTypes` (Storybook docgen infers controls), placeholder TODOs for color and date values, `fn()` for callbacks. Treat them as a
   starting point and apply the **author-and-review-stories-storybook-jetbrains** skill: replace TODO placeholders with realistic
   values, add `play` functions that interact and assert (especially for `fn()` callbacks), and cover behavior-changing states the
   type-driven plan cannot see (loading, error, permissions, async).
6. **Offer pages/screens** — once component coverage work is done, ask whether the user also wants stories for pages/screens.

## Scope: components only (by default)

Generate and audit stories for **reusable UI components** only — buttons, inputs, cards, badges, menus, dialogs, and similar building
blocks.

**Do not** create stories for pages, screens, routes, layouts, app shells, or other top-level composition surfaces as part of the default
workflow. Those are out of scope until the user explicitly asks for them.

**After** component work is finished (discovery, missing-story audit, and story creation/enhancement for components), ask the user something
like:

> I've covered the reusable components. Would you also like stories for
> pages/screens (or other top-level surfaces)?

Only proceed with pages/screens if they confirm. When they do, still use this CLI for generation and the
**author-and-review-stories-storybook-jetbrains** skill for quality.

## What it will and won't do

- Enum props render as member references (`BadgeTone.Info`) with the import managed; enums declared in the component file fold into its
  import line.
- Story names avoid shadowing globals (`Error` becomes `ToneError`) and collisions get prop-prefixed names (`SizeSmall`).
- Coverage reads CSF3 object-literal exports (including `satisfies` and
  `meta.args` merging). Template/function stories are flagged, not guessed.
- Nested-object props are reported as unsupported and skipped in plans — write those stories by hand.
- `--args` keys that aren't extracted props trigger a warning (typo, or an inherited prop that extraction filtered out) but are still
  applied.

After creating or changing stories, follow the author-and-review-stories-storybook-jetbrains skill's guidance on verifying them in
Storybook and sharing story links.
