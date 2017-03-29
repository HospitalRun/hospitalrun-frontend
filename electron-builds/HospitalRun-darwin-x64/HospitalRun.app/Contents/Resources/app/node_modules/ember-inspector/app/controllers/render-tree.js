import Ember from "ember";
import escapeRegExp from "ember-inspector/utils/escape-reg-exp";
import debounceComputed from "ember-inspector/computed/debounce";

const { computed, isEmpty, Controller, inject: { controller } } = Ember;
const { and, equal, filter } = computed;
const get = Ember.get;

export default Controller.extend({
  application: controller(),
  initialEmpty: false,
  modelEmpty: equal('model.length', 0),
  showEmpty: and('initialEmpty', 'modelEmpty'),

  // bound to the input field, updates the `search` property
  // 300ms after changing
  searchField: debounceComputed('search', 300),

  // model filtered based on this value
  search: '',

  escapedSearch: computed('search', function() {
    return escapeRegExp(this.get('search').toLowerCase());
  }),

  filtered: filter('model', function(item) {
    let search = this.get('escapedSearch');
    if (isEmpty(search)) {
      return true;
    }
    let regExp = new RegExp(search);
    return !!recursiveMatch(item, regExp);
  }).property('model.@each.name', 'search')
});

function recursiveMatch(item, regExp) {
  let children, child;
  let name = get(item, 'name');
  if (name.toLowerCase().match(regExp)) {
    return true;
  }
  children = get(item, 'children');
  for (let i = 0; i < children.length; i++) {
    child = children[i];
    if (recursiveMatch(child, regExp)) {
      return true;
    }
  }
  return false;
}
