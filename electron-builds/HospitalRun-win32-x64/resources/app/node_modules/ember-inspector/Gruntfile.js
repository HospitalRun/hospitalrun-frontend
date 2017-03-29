module.exports = function(grunt) {
  var packageJson = grunt.file.readJSON('package.json');
  var versionedPane = 'panes-' + packageJson.emberVersionsSupported[0].replace(/\./g, '-');
  var config = {
    pkg: packageJson,
    env: process.env,
    "jpm": {
      options: {
        src: "dist/firefox",
        xpi: "tmp/xpi"
      }
    },
    "s3": {
      options: {
        bucket: 'ember-extension',
        access: 'public-read',
        headers: {
          // One day cache policy (1000 * 60 * 60 * 24)
          "Cache-Control": "max-age=86400000, public"
        }
      },
      bookmarklet: {
        sync: [{
          src: 'dist/bookmarklet/**/*.*',
          dest: 'dist_bookmarklet/',
          rel: 'dist/bookmarklet',
          options: { verify: true }
        }]
      }
    },
    "compress": {
      main: {
        options: {
          archive: 'dist/chrome/ember-inspector.zip'
        },
        expand: true,
        pretty: true,
        src: 'dist/chrome/**/*'
      },
      "chrome-pane": {
        options: {
          archive: 'dist/chrome-pane.zip'
        },
        expand: true,
        pretty: true,
        cwd: 'dist/chrome/' + versionedPane,
        src: ['**/*']
      },
      "firefox-pane": {
        options: {
          archive: 'dist/firefox-pane.zip'
        },
        expand: true,
        pretty: true,
        cwd: 'dist/firefox/data/' + versionedPane,
        src: ['**/*']
      },
      "bookmarklet-pane": {
        options: {
          archive: 'dist/bookmarklet-pane.zip'
        },
        expand: true,
        pretty: true,
        cwd: 'dist/bookmarklet/' + versionedPane,
        src: ['**/*']
      }
    }
  };

  grunt.initConfig(config);

  grunt.loadNpmTasks('grunt-jpm');
  grunt.loadNpmTasks('grunt-s3');
  grunt.loadNpmTasks('grunt-contrib-compress');

  grunt.registerTask('build-xpi', ['jpm:xpi']);

  grunt.registerTask('run-xpi', ['jpm:run']);

  grunt.registerTask('clean-tmp', function() {
    grunt.file.delete('./tmp');
  });
};
