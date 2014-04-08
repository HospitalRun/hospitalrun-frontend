/*global module */

module.exports = function (grunt) {
	'use strict';

	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		clean : {
			dist : [ 'dist' ]
		},
		concat : {
			options : {
				separator : '\n'
			},
			specs : {
				src : [
					'src/lib/cryptojs/hmac-sha1.js',
					'src/lib/cryptojs/enc-base64-min.js',
					'src/lib/url.min.js',
					'src/app/oauth-signature.js'
				],
				dest : 'dist/oauth-signature.js',
				nonull : true
			}
		},
		uglify : {
			dist : {
				files : {
					'dist/oauth-signature.min.js' : [ 'dist/oauth-signature.js' ]
				},
				options : {
					// sourceMap : '<%= cfg.dist.dir %>/pub.min.map.js';
				}
			}
		},
		mochaTest : {
			dev : {
				src : ['src/app/*.mocha.js'],
				options : {
					ui : 'qunit',
					reporter : 'spec'
				}
			}
		},
		karma : {
			options : {
				basePath : '',
				frameworks : [ 'qunit' ],
				exclude : [ ],
				reporters : [ 'dots' ],
				port : 9876,
				colors : true,
				logLevel : 'WARN',
				autoWatch : false,
				browsers : [ 'PhantomJS' ],
				captureTimeout : 60000
			},
			dev : {
				options : {
					singleRun : true,
					files : [
						'src/lib/url.min.js',
						'src/lib/cryptojs/hmac-sha1.js',
						'src/lib/cryptojs/enc-base64-min.js',
						'src/app/oauth-signature.js',
						'src/app/oauth-signature.tests.qunit.js'
					]
				}
			},
			dist : {
				options : {
					singleRun : true,
					files : [
						'dist/oauth-signature.min.js',
						'src/app/oauth-signature.tests.qunit.js'
					]
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-mocha-test');

	grunt.registerTask('build', [ 'clean', 'concat', 'uglify', 'test-build' ]);
	grunt.registerTask('test', [ 'karma:dev:start' ]);
	grunt.registerTask('test-build', [ 'mochaTest:dev', 'karma:dist:start' ]);
};
