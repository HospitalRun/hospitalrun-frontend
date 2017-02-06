import Ember from 'ember';

const {
  computed,
  isEmpty,
  get,
  set
} = Ember;

export function addProcedure(model) {
  let procedures = get(model, 'procedures');
  let description = get(model, 'procedureDescription');
  if (!isEmpty(description)) {
    procedures.addObject({
      description
    });
    set(model, 'procedureDescription', null);
  }
}

export default Ember.Component.extend({
  model: null,
  procedureList: null,
  haveProcedures: computed('model.procedures.[]', {
    get() {
      return !isEmpty(get(this, 'model.procedures'));
    }
  }),

  actions: {
    addProcedure() {
      let model = get(this, 'model');
      addProcedure(model);
    },

    deleteProcedure(procedureToDelete) {
      let model = get(this, 'model');
      let procedures = get(model, 'procedures');
      procedures.removeObject(procedureToDelete);
      model.validate();
    }
  }

});
