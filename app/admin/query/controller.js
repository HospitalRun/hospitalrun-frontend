import Ember from 'ember';
import EditPanelProps from 'hospitalrun/mixins/edit-panel-props';
import SelectValues from 'hospitalrun/utils/select-values';
export default Ember.Controller.extend(EditPanelProps, {
  hideCancelButton: true,
  showUpdateButton: true,
  updateButtonAction: 'query',
  updateButtonText: 'Query', // admin function not requiring i8ln

  objectTypeList: [
    'appointment',
    'imaging',
    'inv-location',
    'inv-purchase',
    'inv-request',
    'inventory',
    'invoice',
    'lab',
    'medication',
    'patient',
    'photo',
    'procedure',
    'visit',
    'vital'
  ],

  objectTypes: Ember.computed.map('objectTypeList', SelectValues.selectValuesMap),

  actions: {
    query: function() {
      let fieldName = this.get('fieldName');
      let objectType = this.get('objectType');
      let queryValue = this.get('queryValue');
      let query = {
        containsValue: {
          value: queryValue,
          keys: [fieldName]
        }
      };
      this.store.query(objectType, query).then(function(results) {
        if (Ember.isEmpty(results)) {
          this.set('errorMessage', 'Query returned no results.');
          this.set('haveError', true);
          this.set('showQueryResults', false);
        } else {
          let currentValue;
          let attributes = ['id'];
          let resultRows = [];
          results.get('firstObject').eachAttribute(function(name) {
            attributes.push(name);
          });

          results.forEach(function(result) {
            let resultRow = [];
            /* resultRow.push({
                name: 'id',
                value: result.get('id')
            }); */
            attributes.forEach(function(attribute) {
              currentValue = result.get(attribute);
              if (!Ember.isEmpty(currentValue)) {
                resultRow.push({
                  name: attribute,
                  value: currentValue
                });
              }
            });
            resultRows.push(resultRow);
          });
          this.set('resultRows', resultRows);
          this.set('haveError', false);
          this.set('showQueryResults', true);
        }
      }.bind(this), function(error) {
        this.set('errorMessage', error);
        this.set('haveError', true);
        this.set('showQueryResults', false);
      }.bind(this));
    }
  }
});
