var csso = require('csso');
var handlebars = require('ember-handlebars');
var shell = require('shelljs');
var uglify = require('uglify-js');

var license = '/* ember-calendar ' + require('./component.json').version + ' (https://github.com/joinspoton/ember-calendar) | (c) 2013 SpotOn (https://spoton.it) | http://www.opensource.org/licenses/MIT */\n';

var rawTemplates = '';
var preTemplates = '';

shell.cd(__dirname);

shell.rm('-r', 'dist');
shell.mkdir('dist');

shell.cat('src/calendar.html').split('</script>').slice(0, -1).forEach(function (source) {
  var name = source.match(/data-template-name=\'(.*)\'/)[1];
  var code = source.replace(/<script.*/gm, '');
  
  var raw = JSON.stringify(code);
  var pre = handlebars.precompile(code);
  
  rawTemplates += 'Ember.TEMPLATES["' + name + '"] = Ember.Handlebars.compile(' + raw + ');\n';
  preTemplates += 'Ember.TEMPLATES["' + name + '"] = Ember.Handlebars.template(' + pre + ');\n';
});

(license + shell.cat('src/calendar.css')).to('dist/ember-calendar.css');
(license + rawTemplates + shell.cat('src/calendar.js')).to('dist/ember-calendar.js');
(license + preTemplates + shell.cat('src/calendar.js')).to('dist/ember-calendar.pre.js');

(license + csso.justDoIt(shell.cat('dist/ember-calendar.css'))).to('dist/ember-calendar.min.css');
(license + uglify.minify('dist/ember-calendar.js').code).to('dist/ember-calendar.min.js');
(license + uglify.minify('dist/ember-calendar.pre.js').code).to('dist/ember-calendar.pre.min.js');