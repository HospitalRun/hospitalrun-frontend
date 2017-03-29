import Ember from "ember";
import debounceComputed from "ember-inspector/computed/debounce";
import searchMatch from "ember-inspector/utils/search-match";
const { Controller, computed, get, inject: { controller } } = Ember;
const { filter } = computed;

export default Controller.extend({
  /**
   * Used by the view for content height calculation
   *
   * @property application
   * @type {Controller}
   */
  application: controller(),
  search: null,
  searchVal: debounceComputed('search', 300),
  filtered: filter('model', function(item) {
    return searchMatch(get(item, 'message'), this.get('search'));
  }).property('model.@each.message', 'search'),
  actions: {
    openResource(item) {
      this.get('adapter').openResource(item.fullSource, item.line);
    },

    traceSource(deprecation, source) {
      this.get('port').send('deprecation:sendStackTraces', {
        deprecation: {
          message: deprecation.message,
          sources: [source]
        }
      });
    },

    traceDeprecations(deprecation) {
      this.get('port').send('deprecation:sendStackTraces', {
        deprecation
      });
    }
  }
});
