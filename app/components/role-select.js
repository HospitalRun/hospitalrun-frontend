import Ember from 'ember';
export default Ember.Component.extend({
  // possible passed-in values with their defaults:
  content: null,
  prompt: null,
  optionValuePath: 'roles',
  optionLabelPath: 'name',
  action: Ember.K, // action to fire on change

  // shadow the passed-in `selection` to avoid
  // leaking changes to it via a 2-way binding
  _selection: Ember.computed.reads('selection'),

  init() {
    this._super(...arguments);
    if (!this.get('content')) {
      this.set('content', []);
    }
  },

  actions: {
    change() {
      let selectEl = this.$('select')[0];
      let selectedIndex = selectEl.selectedIndex;
      let content = this.get('content');

      // decrement index by 1 if we have a prompt
      let hasPrompt = !!this.get('prompt');
      let contentIndex = hasPrompt ? selectedIndex - 1 : selectedIndex;

      let selection = content[contentIndex].roles;

      // set the local, shadowed selection to avoid leaking
      // changes to `selection` out via 2-way binding
      this.set('_selection', selection);

      let changeCallback = this.get('action');
      changeCallback(selection);
    }
  }
});
