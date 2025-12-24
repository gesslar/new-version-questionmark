const core = require('@actions/core');
const fs = require('fs');
const { execSync } = require('child_process');
const compareVersions = require('compare-versions');

try {
  // Get inputs
  const source = core.getInput('source') || './package.json';
  const versionPattern = new RegExp(core.getInput('version_pattern') || 'v\\d+\\.\\d+\\.\\d+');

  let currentVersion;

  // Determine current version
  if (source === 'package.json') {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    currentVersion = packageJson.version;
  } else {
    currentVersion = fs.readFileSync(source, 'utf8').trim();
  }

  // Fetch Git tags and find the latest version
  const tags = execSync(`git fetch --tags && git tag`)
    .toString()
    .split('\n')
    .filter(Boolean);

  // TODO: figure out why we're only getting 1 tag
  //    gesslar / new- version - questionmark@main
  //    with:
  //    source: package.json
  //    version_pattern: v\d +\.\d +\.\d +
  //
  //      Tags: ["v1.0.2"]
  //  Latest tag: "v1.0.2"
  //  Current version: 1.0.3, Latest version: v1.0.2

  core.info(`Tags: ${JSON.stringify(tags)}`);

  // Use compare-versions to find the latest tag
  const latestTag = tags.reduce((latest, current) => {
    const currentVer = current;
    const latestVer = latest || null;

    try {
      return compareVersions.compare(currentVer, latestVer, ">") ? current : latest;
    } catch (e) {
      // If comparison fails, fallback to the current latest
      return latest;
    }
  });

  core.info(`Latest tag: ${JSON.stringify(latestTag)}`);
  const latestVersion = latestTag ? latestTag : null;

  core.info(`Current version: ${currentVersion}, Latest version: ${latestVersion}`);

  // Compare versions and set output
  if (!latestVersion) {
    core.setOutput('updated_version', currentVersion); // First version
  } else {
    try {
      const hasUpdate = compareVersions.compare(currentVersion, latestVersion, ">")
      core.setOutput('updated_version', hasUpdate ? currentVersion : 'no changes');
    } catch (e) {
      core.setFailed(`Version comparison failed: ${e.message}`);
    }
  }
} catch (error) {
  core.setFailed(`Action failed with error: ${error.message}`);
}
