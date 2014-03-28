/*jshint node:true */
module.exports = function( grunt ) {

grunt.loadNpmTasks( "grunt-git-authors" );
grunt.loadNpmTasks( "grunt-contrib-jshint" );
grunt.loadNpmTasks( "grunt-contrib-qunit" );
grunt.loadNpmTasks( "grunt-contrib-watch" );

grunt.initConfig({
	qunit: {
		qunit: [
			"test/index.html",
			"test/async.html",
			"test/logs.html",
			"test/setTimeout.html"
		]
	},
	jshint: {
		options: {
			jshintrc: ".jshintrc"
		},
		gruntfile: [ "Gruntfile.js" ],
		qunit: [ "qunit/**/*.js" ],
		addons: {
			options: {
				jshintrc: "addons/.jshintrc"
			},
			files: {
				src: [ "addons/**/*.js" ]
			}
		},
		tests: {
			options: {
				jshintrc: "test/.jshintrc"
			},
			files: {
				src: [ "test/**/*.js" ]
			}
		}
	},
	watch: {
		files: [ "*", ".jshintrc", "{addons,qunit,test}/**/{*,.*}" ],
		tasks: "default"
	}
});

grunt.registerTask( "build-git", function( sha ) {
	function processor( content ) {
		var tagline = " - A JavaScript Unit Testing Framework";
		return content.replace( tagline, "-" + sha + " " + grunt.template.today("isoDate") + tagline );
	}
	grunt.file.copy( "qunit/qunit.css", "dist/qunit-git.css", {
		process: processor
	});
	grunt.file.copy( "qunit/qunit.js", "dist/qunit-git.js", {
		process: processor
	});
});

grunt.registerTask( "testswarm", function( commit, configFile ) {
	var testswarm = require( "testswarm" ),
		config = grunt.file.readJSON( configFile ).qunit,
		runs = {},
		done = this.async();
	["index", "async", "setTimeout"].forEach(function (suite) {
		runs[suite] = config.testUrl + commit + "/test/" + suite + ".html";
	});
	testswarm.createClient( {
		url: config.swarmUrl,
		pollInterval: 10000,
		timeout: 1000 * 60 * 30
	} )
	.addReporter( testswarm.reporters.cli )
	.auth( {
		id: config.authUsername,
		token: config.authToken
	} )
	.addjob(
		{
			name: "QUnit commit #<a href='https://github.com/jquery/qunit/commit/" + commit + "'>" + commit.substr( 0, 10 ) + "</a>",
			runs: runs,
			browserSets: config.browserSets
		}, function( err, passed ) {
			if ( err ) {
				grunt.log.error( err );
			}
			done( passed );
		}
	);
});

grunt.registerTask("default", ["jshint", "qunit"]);

};
