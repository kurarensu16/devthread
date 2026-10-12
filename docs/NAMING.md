# DevThread naming decision

The user selected **DevThread** on 2026-10-11 after reviewing alternatives to DevMap. Display the product as `DevThread`, use `devthread` as the skill/package identifier, and use `.devthread/` for new repository state.

The brand reflects continuity across development sessions. The tagline remains: “Know what's built. See what's next. Keep AI development on track.”

## Initial name checks

These are read-only lookup results from 2026-10-11, not reservations or purchase confirmations.

| Name | Lookup | Observed result |
| --- | --- | --- |
| `devthread` on npm | [npm registry](https://registry.npmjs.org/devthread) | HTTP 404: no package record returned |
| `devthread` on PyPI | [PyPI JSON API](https://pypi.org/pypi/devthread/json) | HTTP 404: no package record returned |
| `devthread.dev` | [Google Registry RDAP](https://pubapi.registry.google/rdap/domain/devthread.dev) | HTTP 404: no domain registration record returned; confirm registrability with a registrar |
| `devthread.com` | [Verisign RDAP](https://rdap.verisign.com/com/v1/domain/devthread.com) | HTTP 200: registration record exists |
| `devthread.io` | RDAP lookup attempted at `rdap.nic.io` | Unverified: lookup hostname did not resolve |

Existing name uses include a [programming tutorial channel](https://whix100.github.io/) and a [developer forum template](https://www.rocket.new/templates/devthread-midnight-forum-landing-page-template). The initial search did not identify a directly competing repository-state agent skill. At the time of these initial checks, no domain, package name, or GitHub repository had been reserved or created.

## GitHub repository update

Later on 2026-10-11, the user created [kurarensu16/devthread](https://github.com/kurarensu16/devthread). The local `origin` and website links now use that repository. After the user approved the initial commit and push, the source was uploaded on `master` at `d160615`. Domain and package reservations remain unchanged; npm publication is pending.

## Repository and saved state

The skill source is `skill/devthread/`. This repository's active map and example maps were moved to `.devthread/`. The workspace remains at `C:/Users/sadia/DevMap`; absolute paths in earlier evidence refer to that existing workspace and the files as named when tested.

All scripts support an existing `.devmap/` directory without relocating or replacing its files. If both old and new state paths exist, they stop with an ambiguity error. The partially populated legacy fixture is retained unchanged so preservation continues to be tested.

Historical reports, prior decisions, and existing `AGENTS.md` files retain their original wording. Current guides use the new commands. Fresh-chat discovery under `$devthread` must be checked separately from the previous `$devmap` sessions before claiming it was tested.
