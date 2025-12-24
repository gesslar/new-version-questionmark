# Determine Version GitHub Action

Find the current project version and compare it with the latest Git tag that matches a pattern. The action outputs either the new version to publish or `no changes` when the version has not advanced.

## How It Works

- Reads the current version from `package.json` by default, or from any file path you provide (contents are trimmed).
- Fetches all tags and filters them with a regex pattern (default: `v\d+\.\d+\.\d+`).
- Uses semantic comparison to pick the newest matching tag and compares it to the current version.
- Sets the `updated_version` output to the current version when it is newer than the latest tag; otherwise sets it to `no changes`. If there are no matching tags, the current version is returned.

## Usage

Add a step to your workflow after checkout (ensure tags are fetched). Adjust `source` and `version_pattern` as needed.

```yaml
jobs:
  version-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Determine version
        id: version
        uses: gesslar/new-version-questionmark@v1
        with:
          # Reads package.json by default; point to another file if needed.
          source: package.json
          # Optional: override the tag regex; this example matches v1.2.3 style tags.
          version_pattern: "v\\d+\\.\\d+\\.\\d+"

      - name: Show result
        run: echo "Updated version: ${{ steps.version.outputs.updated_version }}"
```

## Inputs

- `source` (optional): `package.json` or a file path containing the version string. Default: `package.json`.
- `version_pattern` (optional): Regex used to filter tags. Default: `v\d+\.\d+\.\d+`.

## Outputs

- `updated_version`: The current version string if it is newer than the latest matching tag, `no changes` otherwise.

## Development

```sh
npm install
npm run build  # bundles to action/index.js
```
