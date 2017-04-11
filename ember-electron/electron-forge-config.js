/* eslint quotes: ["error", "double"] */
module.exports = {
  "make_targets": {
    "win32": [
      "squirrel"
    ],
    "darwin": [
      "zip",
      "dmg"
    ],
    "linux": [
      "deb",
      "rpm"
    ]
  },
  "electronPackagerConfig": {
    "all": true,
    "appCopyright": "2014-2017 HospitalRun community",
    "dir": ".",
    "icon": "icons/icon.icns",
    "osxSign": true
  },
  "electronWinstallerConfig": {
    "name": "HospitalRun"
  },
  "electronInstallerDMG": {
    "background": "icons/bg-img-patients.png",
    "icon": "icons/favicon.icns",
    "overwrite": true
  },
  "electronInstallerDebian": {},
  "electronInstallerRedhat": {},
  "github_repository": {
    "owner": "HospitalRun",
    "name": "hospitalrun-releases",
    "draft": true,
    "prerelease": true
  }
  /* ,
  "publish_targets": {
    "win32": [
      "github"
    ],
    "darwin": [
      "github"
    ],
    "linux": [
      "github"
    ]
  }*/
};
