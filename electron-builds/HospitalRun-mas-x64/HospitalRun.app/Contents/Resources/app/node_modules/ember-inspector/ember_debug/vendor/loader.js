var define = window.define, requireModule = window.requireModule;
if (typeof define !== 'function' || typeof requireModule !== 'function') {

  (function() {
    var registry = {}, seen = {};

    define = function(name, deps, callback) {
      if (arguments.length < 3) {
        callback = deps;
        deps = [];
      }
      registry[name] = { deps: deps, callback: callback };
    };

    requireModule = function(name) {
      if (seen[name]) { return seen[name]; }
      seen[name] = {};

      var mod = registry[name];

      if (!mod) {
        throw new Error("Module: '" + name + "' not found.");
      }

      var deps = mod.deps;
      var callback = mod.callback;
      var reified = [];
      var exports;

      for (var i = 0, l = deps.length; i < l; i++) {
        if (deps[i] === 'exports') {
          reified.push(exports = {});
        } else {
          reified.push(requireModule(deps[i]));
        }
      }

      var value = callback.apply(this, reified);
      seen[name] = exports || value;
      return seen[name];
    };

    define.registry = registry;
    define.seen = seen;
  })();
}
