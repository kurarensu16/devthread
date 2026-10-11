# Contributing to DevThread

DevThread's skill and local website are implemented, with release work still pending. Before adding behavior, read [the format](docs/FORMAT.md), [workflow contract](docs/WORKFLOWS.md), and [roadmap](docs/ROADMAP.md). Keep the skill usable without a DevThread service or paid model API.

Changes should preserve existing user files, record how behavior was checked, and distinguish observed facts from inferences. Add focused tests for script behavior, especially initialization, malformed state, dependency references, and cycles. Do not describe an agent as supported until installation and a representative workflow have been tested on that agent.

Run tests from the repository root with `python -m unittest discover -s tests -p 'test_*.py'`. Each CLI script also supports `--help`. From `website/`, run `npm run lint`, `npm run typecheck`, `npm run build`, and `npm run check:links`. See [website setup](website/README.md) for local preview and publication configuration.

The root npm package requires Node 22+ and has no runtime dependencies. Run `npm test` for installer preservation checks and an offline installation of the actual archive, including its Python scripts. Use `npm pack --ignore-scripts` to inspect the publishable archive. CI targets Windows, Linux, and macOS with Node 22 and 24 and Python 3.13. Record native results before calling an OS tested; path simulation alone is insufficient.

Use the [GitHub repository](https://github.com/kurarensu16/devthread) for issues or pull requests once the initial source has been pushed. Include the problem, the intended behavior, and exact verification commands and results. No contributor license agreement is required by this repository at this stage.
