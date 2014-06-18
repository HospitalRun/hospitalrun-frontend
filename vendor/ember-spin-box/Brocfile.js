var env = require('broccoli-env').getEnv(),
    mergeTrees = require('broccoli-merge-trees'),
    pickFiles = require('broccoli-static-compiler'),
    concat = require('broccoli-concat'),
    uglifyJs = require('broccoli-uglify-js'),
    compileLess = require('broccoli-less-single'),
    buildTemplates = require('broccoli-template-builder'),
    compileTemplates = require('ember-template-compiler'),
    sourceTree = 'lib',
    stylesTree = 'lib/styles',
    templatesTree = 'lib/templates',
    templates,
    js,
    css,
    prodJs,
    prodCss;

templates = buildTemplates(templatesTree, {
    extensions: ['hbs'],
    outputFile: 'templates.js',
    namespace: 'Ember.TEMPLATES',
    compile: function(string) {
        return 'Ember.Handlebars.template(' + compileTemplates.precompile(string) + ')';
    }
});

js = concat(mergeTrees([templates, sourceTree]), {
    inputFiles: [
        'components/**/*.js',
        'views/**/*.js',
        'templates-top.js',
        'templates.js',
        'templates-bottom.js',
        'main.js'
    ],
    outputFile: '/ember-spin-box.js'
});

css = compileLess(
    [stylesTree], 
    'ember-spin-box.less', 
    'ember-spin-box.css'
);

//create minified versions for production
if(env === 'production') {
    prodJs = uglifyJs(concat(mergeTrees([templates, sourceTree]), {
        inputFiles: [
            'components/**/*.js',
            'views/**/*.js',
            'templates-top.js',
            'templates.js',
            'templates-bottom.js',
            'main.js'
        ],
        outputFile: '/ember-spin-box.min.js'
    }));

    prodCss = compileLess(
        [stylesTree], 
        'ember-spin-box.less', 
        'ember-spin-box.min.css', 
        {cleancss: true}
    );
}

module.exports = mergeTrees(env === 'production' ? [templates, prodJs, prodCss, js, css] : [templates, js, css]);