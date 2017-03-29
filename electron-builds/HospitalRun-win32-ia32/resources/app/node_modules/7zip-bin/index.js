"use strict"

const nameMap = {
  "darwin": "mac",
  "win32": "win",
  "linux": "linux",
}

const suffix = nameMap[process.platform]
if (suffix == null) {
  throw new Error("Unsupported platform " + process.platform)
}
exports.path7za = process.env.USE_SYSTEM_7ZA === "true" ? "7za" : require(`7zip-bin-${suffix}`).path7za