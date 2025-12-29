import core from "@actions/core"
import {CappedDirectoryObject, Data, Sass} from "@gesslar/toolkit"
import compareVersions from "compare-versions"
import {execSync} from "node:child_process"

const dataExt = [".json",".json5",".jsonc",".yaml",".yml"]

void (async() => {
  try {
    // Get inputs
    const cwd = new CappedDirectoryObject(".")
    const source = cwd.getFile(core.getInput("source") || "package.json")
    const versionPattern = new RegExp(core.getInput("version_pattern") || "v\\d+\\.\\d+\\.\\d+")

    if(!await source.exists)
      throw Sass.new(`No such file ${cwd.real.url}`)

    // Determine current version
    let currentVersion

    if(dataExt.includes(`${source.extension}`)) {
      const data = await source.loadData()

      currentVersion = data?.version
    } else {
      const data = await source.read()

      currentVersion = data?.trim()
    }

    if(!currentVersion)
      throw Sass.new(`Unable to determine current version from ${cwd.real.url}`)

    // Fetch Git tags and find the latest version
    const allTags = execSync("git fetch --tags && git tag")
      .toString()
      .split("\n")
      .filter(Boolean)
    core.info(`All tags: ${JSON.stringify(allTags)}`)

    // Filter tags that match the version pattern
    const tags = allTags.filter(tag => versionPattern.test(tag))
    core.info(`Filtered tags (matching pattern): ${JSON.stringify(tags)}`)

    // Use compare-versions to find the latest tag
    const latestTag = tags.reduce((latest, current) => {
      const currentVer = current
      const latestVer = latest || null

      try {
        return compareVersions.compare(currentVer, latestVer, ">") ? current : latest
      } catch {
      // If comparison fails, fallback to the current latest
        return latest
      }
    }, "")

    core.info(`Latest tag: ${JSON.stringify(latestTag)}`)
    const latestVersion = latestTag ? latestTag : null

    core.info(`Current version: '${currentVersion}', Latest version: '${latestVersion}'`)

    // Compare versions and set output
    if(Data.isType(latestVersion, "Null")) {
      core.setOutput("updated_version", currentVersion) // First version
    } else {
      try {
        core.info(`Comparing '${currentVersion}' to '${latestVersion}'`)

        const hasUpdate = compareVersions.compare(currentVersion, latestVersion, ">")
        core.setOutput("updated_version", hasUpdate ? currentVersion : "no changes")
      } catch(e) {
        core.setFailed(`Version comparison failed: ${e.message}`)
      }
    }
  } catch(error) {
    core.setFailed(`Action failed with error: ${error.message}`)
  }
})()
