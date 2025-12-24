# GitHub Copilot Instructions

This repository contains a GitHub Action for automatic version difference detection.

## Repository Overview

This is a JavaScript-based GitHub Action that compares version numbers from package.json or other sources against Git tags to determine if a new version has been released.

## Technology Stack

- **Runtime**: Node.js 20
- **Dependencies**: 
  - `@actions/core`: GitHub Actions toolkit
  - `compare-versions`: Version comparison library
- **Build Tool**: `@vercel/ncc` for bundling the action

## Development Workflow

### Building the Action

```bash
npm install
npm run build
```

The build process uses `@vercel/ncc` to bundle `index.js` into `action/index.js`.

### Testing Locally

This action is designed to run within GitHub Actions environment. It requires:
- Git repository with tags
- Access to package.json or specified version source file

### Making Changes

1. Edit `index.js` for core logic changes
2. Update `action.yml` if modifying inputs/outputs
3. Run `npm run build` to compile to `action/index.js`
4. The compiled action in `action/` directory should be committed

## Coding Conventions

- Use Node.js built-in modules where possible (`fs`, `child_process`)
- Follow the existing error handling pattern with try-catch and `core.setFailed()`
- Use `core.info()` for logging informational messages
- Use `core.getInput()` for reading action inputs
- Use `core.setOutput()` for setting action outputs
- Maintain backward compatibility with existing inputs and outputs

## Action Behavior

- Reads current version from `package.json` or specified source file
- Fetches Git tags and finds the latest version using semantic version comparison
- Compares current version against latest tag
- Outputs either the updated version or "no changes"

## Files Not to Modify

- `.github/workflows/compile_action.yml`: Auto-build workflow, only modify if changing CI/CD process
- `LICENSE`: Public domain Unlicense
- `node_modules/`: Dependencies directory (not committed)
- `action/index.js`: Auto-generated, modify `index.js` instead

## Version Management

- This repository uses semantic versioning (e.g., v1.3.15)
- Tags trigger the build workflow which auto-compiles the action
- Version in `package.json` should be updated before tagging

## Key Considerations

- The action uses `execSync` for Git commands, ensure proper error handling
- The action expects to run in a Git repository with tags
- Version comparison uses the `compare-versions` library for semantic version parsing
- Default version pattern is `v\d+\.\d+\.\d+` but can be customized via input
