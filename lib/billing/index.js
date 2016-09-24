/*jshint node:true*/
var EngineAddon = require('ember-engines/lib/engine-addon');
module.exports = EngineAddon.extend({
  name: 'billing',

  isDevelopingAddon: function() {
    return true;
  }
});
