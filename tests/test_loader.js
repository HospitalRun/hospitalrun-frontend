// TODO: load based on params
Ember.keys(requirejs._eak_seen).filter(function(key) {
  return (/\-test/).test(key);
}).forEach(function(moduleName) {
  require(moduleName, null, null, true);
});
