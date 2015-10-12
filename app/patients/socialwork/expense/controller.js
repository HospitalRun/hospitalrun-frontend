import Ember from 'ember';
import IsUpdateDisabled from 'hospitalrun/mixins/is-update-disabled';
import SelectValues from 'hospitalrun/utils/select-values';
export default Ember.ObjectController.extend(IsUpdateDisabled, {
  needs: 'patients',

  categoryTypes: [
    'Clothing',
    'Education',
    'Electricity',
    'Food',
    'Fuel',
    'Other',
    'Rent',
    'Transportation',
    'Water'
  ].map(SelectValues.selectValuesMap),

  editController: Ember.computed.alias('controllers.patients'),
  showUpdateButton: true,
  title: 'Expense',
  updateButtonAction: 'update',
  updateButtonText: function() {
    if (this.get('isNew')) {
      return 'Add';
    } else {
      return 'Update';
    }
  }.property('isNew'),

  actions: {
    cancel: function() {
      this.send('closeModal');
    },

    update: function() {
      var model = this.getProperties('isNew', 'category', 'sources', 'cost');
      this.get('editController').send('updateExpense', model);
    }
  }
});
