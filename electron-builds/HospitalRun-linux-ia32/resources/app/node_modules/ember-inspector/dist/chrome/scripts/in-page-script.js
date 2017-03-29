/**
 * The Chrome and Firefox extensions inject the in-page-script into the
 * page to deteremine the version of Ember the ClientApp is running.
 *
 * An iife runs to gather the data and uses postMessage to send the data back
 * to the extension.
 *
 * @namespace EmberInspector/Shared
 * @class InPageScript
 */
(function($) {
  "use strict";
  if (!$) { return; }
  $(function() {
    var libraries = window.Ember && window.Ember.libraries;
    if (libraries) {
      // Ember has changed where the array of libraries is located.
      // In older versions, `Ember.libraries` was the array itself,
      // but now it's found under _registry.
      if (libraries._registry) {
        libraries = libraries._registry;
      }

      var versions = Array.prototype.slice.call(libraries, 0);
      window.postMessage({
        type: 'emberVersion',
        versions: versions
      }, '*');
    }
  });
}(window.jQuery));
