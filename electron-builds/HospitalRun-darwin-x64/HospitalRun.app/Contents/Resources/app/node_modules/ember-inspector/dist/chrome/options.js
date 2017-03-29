/*global chrome*/

/**
 * Extension options for Chrome.
 * This allows the user to decide if the Tomster icon should show when visiting
 * a webpage that has Ember running.
 *
 * see:
 *     https://developer.chrome.com/extensions/options
 */
(function() {
  "use strict";

  /**
   * Load the options from storage.
   */
  function loadOptions() {
    chrome.storage.sync.get('options', function(data) {
      var options = data.options;

      document.querySelector('[data-settings=tomster]').checked = options.showTomster;
    });
  }

  /**
   * Save the updated options to storage.
   */
  function storeOptions() {
    var showTomster = this.checked;

    chrome.storage.sync.set({
      options: { showTomster: showTomster }
    }, function optionsSaved() {
      console.log("saved!");
    });
  }

  document.addEventListener('DOMContentLoaded', loadOptions);
  document.querySelector('[data-settings=tomster]').addEventListener('click', storeOptions);

}());
