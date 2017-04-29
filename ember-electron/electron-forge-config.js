const path = require('path');

module.exports = {
  make_targets: {
    win32: ['squirrel', 'zip'],
    darwin: ['dmg', 'zip']
  },
  electronPackagerConfig: {
    /* all: true, */
    appCategoryType: 'public.app-category.medical-software',
    appCopyright: 'Copyright (c) 2017 HospitalRun Foundation',
    icon: 'assets/icons/icon',
    name: 'HospitalRun',
    osxSign: true,
    overwrite: true,
    versionString: {
      CompanyName: 'HospitalRun Foundation',
      FileDescription: 'HospitalRun Desktop',
      ProductName: 'HospitalRun',
      InternalName: 'HospitalRun'
    }
  },
  electronInstallerDMG: {
    background: 'assets/icons/bg-img-patients.png',
    debug: true,
    icon: 'assets/icons/favicon.icns',
    iconsize: 100,
    overwrite: true,
    title: 'HospitalRun',
    window: {
      size: {
        width: 400,
        height: 400
      }
    }
  },
  electronWinstallerConfig: {
    authors: 'HospitalRun Foundation',
    exe: 'HospitalRun.exe',
    icon: 'assets/icons/favicon',
    name: 'HospitalRun',
    noMSI: true,
    setupIcon: path.join(__dirname, '../../../assets/icons/favicon.ico'),
    setupExe: 'HospitalRun.exe',
    title: 'HospitalRun'/* ,
     certificateFile: '',
    certificatePassword: '' */
  }
};
