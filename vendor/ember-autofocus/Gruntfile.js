module.exports = function(grunt) {
  "use strict";

  require("load-grunt-tasks")(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        curly: false,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        jquery: true,
        globals: {
          require: true,
          module : true
        }
      },
      all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
    },


    uglify: {
      options: {
        banner: '//! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n'  +
                '//! https://github.com/AndreasPizsa/ember-autofocus\n',
      },
      dist: {
        files: {
          'dist/ember-autofocus.min.js' : 'src/ember-autofocus.js'
        }
      }
    },


    update_json: {
    // update bower.json with data from package.json
      bower: {
        src: 'package.json',    // where to read from
        dest: 'bower.json',     // where to write to
        fields: [               // the fields to update
          'name',
          'version',
          'description',
          'repository',
          'authors'
        ]
      },
      // update component.json with data from package.json
      // component.json fields are a named a bit differently from
      // package.json, so let's tell update_json how to map names
      component: {
        src:  'package.json',        // where to read from
        dest: 'component.json',      // where to write to
        fields: {                    // the fields to update
          // notice how this time we're passing a hash instead
          // of an array; this allows us to map the field names.
          // We still specify all the names we want, and additionally
          // we also specify the target name in the detination file. 
          // from          to
          // -----------   -------------------
          'name'            : null,         // null means 'leave as is'
          'description'     : 'description',// but feel free to type the field name twice
          'repository'      : 'repo',       // rename 'repository' to 'repo'
          'version'         : null,
          'keywords'        : null,
          'main'            : null,
          'dependencies'    : null,
          'devDependencies' : 'development',
          'license'         : null,
        }
      }
    },

    readme: {
      options: {
        metadata: this.pkg
      }
    }
  });

  grunt.registerTask('default',['jshint','uglify','update_json','readme']);
};
