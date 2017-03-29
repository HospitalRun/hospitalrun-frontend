import Ember from 'ember';
import escapeRegExp from "ember-inspector/utils/escape-reg-exp";

const { Component, computed, isEmpty, isNone, run, on, observer, String: { htmlSafe } } = Ember;
const { gt } = computed;
const { once } = run;

export default Component.extend({
  tagName: '',

  search: null,

  isExpanded: false,

  expand() {
    this.set('isExpanded', true);
  },

  searchChanged: on('init', observer('search', function() {
    let search = this.get('search');
    if (!isEmpty(search)) {
      once(this, 'expand');
    }
  })),

  searchMatch: computed('search', 'name', function() {
    let search = this.get('search');
    if (isEmpty(search)) {
      return true;
    }
    let name = this.get('model.name');
    let regExp = new RegExp(escapeRegExp(search.toLowerCase()));
    return !!name.toLowerCase().match(regExp);
  }),

  nodeStyle: computed('searchMatch', function() {
    let style = '';
    if (!this.get('searchMatch')) {
      style = 'opacity: 0.5;';
    }
    return htmlSafe(style);
  }),

  level: computed('target.level', function() {
    let parentLevel = this.get('target.level');
    if (isNone(parentLevel)) {
      parentLevel = -1;
    }
    return parentLevel + 1;
  }),

  nameStyle: computed('level', function() {
    return htmlSafe(`padding-left: ${+this.get('level') * 20 + 5}px;`);
  }),

  hasChildren: gt('model.children.length', 0),

  expandedClass: computed('hasChildren', 'isExpanded', function() {
    if (!this.get('hasChildren')) { return; }

    if (this.get('isExpanded')) {
      return 'list__cell_arrow_expanded';
    } else {
      return 'list__cell_arrow_collapsed';
    }
  }),

  readableTime: computed('model.timestamp', function() {
    let d = new Date(this.get('model.timestamp'));
    let ms = d.getMilliseconds();
    let seconds = d.getSeconds();
    let minutes = d.getMinutes().toString().length === 1 ? `0${d.getMinutes()}` : d.getMinutes();
    let hours = d.getHours().toString().length === 1 ? `0${d.getHours()}` : d.getHours();

    return `${hours}:${minutes}:${seconds}:${ms}`;
  }),

  actions: {
    toggleExpand() {
      this.toggleProperty('isExpanded');
    }
  }
});
