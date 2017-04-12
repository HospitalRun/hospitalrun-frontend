/* eslint quotes: ["error", "double"] */
const path = require('path');

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
    "appCopyright": "Copyright (c) 2017 HospitalRun Foundation",
    "icon": "assets/icons/icon",
    "name": "HospitalRun",
    "osxSign": true,
    "overwrite": true
  },
  "electronWinstallerConfig": {
    "exe": "HospitalRun",
    /* "certificateFile": "",
    "certificatePassword": "", */
    "setupIcon": "assets/icons/favicon.ico",
    "setupExe": "HospitalRun",
    "name": "HospitalRun"
  },
  "electronInstallerDMG": {
    "background": "assets/icons/bg-img-patients.png",
    "icon": "assets/icons/favicon.icns",
    "name": "HospitalRun",
    "overwrite": true,
    "window": {
      "size": {
        width: 600,
        height: 600
      }
    }
  },
  "electronInstallerDebian": {
    "productName": "HospitalRun"
  },
  "electronInstallerRedhat": {
    "productName": "HospitalRun"
  },
  "electronInstallerFlatpak": {
    "productName": "HospitalRun"
  },
  "github_repository": {
    "owner": "tangollama",
    "name": "releases",
    "draft": true,
    "prerelease": true
  },
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
  }
};
