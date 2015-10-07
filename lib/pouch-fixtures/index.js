var Funnel = require('broccoli-funnel');
var exportText = require('broccoli-export-text');

module.exports = {
  name: 'pouch-fixtures',

  isDevelopingAddon: function() {
    return true;
  },

  treeFor: function treeFor(name) {

    if (this._shouldIncludeFiles() && name === 'app') {
      this._requireBuildPackages();

      var fixtures = exportText('tests/fixtures', {
        extensions: 'txt',
        jsesc: {quotes: 'single', wrap: true }
      });

      var tree = new Funnel(fixtures, {
        srcDir: '/',
        destDir: 'tests/fixtures'
      });

      return tree;
    }

    return this._super.treeFor.apply(this, arguments);
  },

  _shouldIncludeFiles: function(){
    return this.app.env !== 'production';
  }
};
