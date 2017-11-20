import Component from '@ember/component';
export default Component.extend({
  action: 'allItems',
  actions: {
    allItems() {
      this.sendAction();
    }
  }
});
