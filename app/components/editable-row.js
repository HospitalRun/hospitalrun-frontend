import Ember from 'ember';

export default Ember.Component.extend({
  isEditing: false,
  tagName: 'tr',
  actions: {
    editRow() {
      this.set('isEditing', true);
    },
    saveRow(row) {
      row.save().then(() => {
        this.set('isEditing', false);
      });
    },
    deleteRow(row) {
      row.destroyRecord().then(() => {
        this.set('isEditing', false);
      });
    }
  }

});
