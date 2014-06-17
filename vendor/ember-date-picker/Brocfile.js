var env = require('broccoli-env').getEnv(),
    mergeTrees = require('broccoli-merge-trees'),
    pickFiles = require('broccoli-static-compiler'),
    concat = require('broccoli-concat'),
    uglifyJs = require('broccoli-uglify-js'),
    compileLess = require('broccoli-less-single'),
    buildTemplates = require('broccoli-template-builder'),
    compileTemplates = require('ember-template-compiler'),
    sourceTree = 'lib',
    templatesTree = 'lib/templates',
    stylesTree = 'lib/styles',
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
        'templates-top.js',
        'templates.js',
        'templates-bottom.js',
        'main.js'
    ],
    outputFile: '/ember-date-picker.js'
});

css = compileLess(
    [stylesTree], 
    'ember-date-picker.less', 
    'ember-date-picker.css'
);

//create minified versions for production
if(env === 'production') {
    prodJs = uglifyJs(concat(mergeTrees([templates, sourceTree]), {
        inputFiles: [
            'components/**/*.js',
            'templates-top.js',
            'templates.js',
            'templates-bottom.js',
            'main.js'
        ],
        outputFile: '/ember-date-picker.min.js'
    }));

    prodCss = compileLess(
        [stylesTree], 
        'ember-date-picker.less', 
        'ember-date-picker.min.css', 
        {cleancss: true}
    );
}

module.exports = mergeTrees(env === 'production' ? [prodJs, prodCss, js, css] : [js, css]);