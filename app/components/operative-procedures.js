<<<<<<< HEAD
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
=======
import Component from '@ember/component';
import { isEmpty } from '@ember/utils';
import { set, get, computed } from '@ember/object';

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

export default Component.extend({
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
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
