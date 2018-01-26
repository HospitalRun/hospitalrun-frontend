import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    dateSetActionWrapper(newDate) {
      if (!Ember.isEmpty(this.get('dateSetAction'))) {
        this.sendAction('dateSetAction', newDate);
      }
    }
  }
});
