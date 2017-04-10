/* global module */
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    appdmg: {
      options: {
        basepath: './electron-builds/HospitalRun-darwin-x64',
        title: 'HospitalRun Desktop',
        icon: '../../icons/favicon.icns',
        background: '../../icons/bg-img-patients.png',
        contents: [
          { x: 448, y: 344, type: 'link', path: '/Applications' },
          { x: 192, y: 344, type: 'file', path: 'HospitalRun.app' }
        ]
      },
      target: {
        dest: 'electron-builds/HospitalRun-darwin-x64/HospitalRun.dmg'
      }
    },
    'create-windows-installer': {
      x64: {
        appDirectory: 'electron-builds/HospitalRun-win32-x64',
        outputDirectory: 'electron-builds/HospitalRun-win32-x64',
        authors: 'HospitalRun',
        exe: 'HospitalRun.exe'
      },
      ia32: {
        appDirectory: 'electron-builds/HospitalRun-win32-ia32',
        outputDirectory: 'electron-builds/HospitalRun-win32-ia32',
        authors: 'HospitalRun',
        exe: 'HospitalRun.exe'
      }
    }
  });
  grunt.loadNpmTasks('grunt-appdmg');
  grunt.loadNpmTasks('grunt-electron-installer');
  grunt.registerTask('default', ['appdmg', 'create-windows-installer']);
};
