import Ember from 'ember';

const {
  isEmpty,
  inject
} = Ember;

export default Ember.Service.extend({
  store: inject.service(),
  getPatientPrefix() {
    let prefix = 'P';
    return this.get('store').findAll('config').then(function(configs){
      const prefixRecord = configs.findBy('id','patient_id_prefix');
      if (!isEmpty(prefixRecord)) {
        return prefixRecord.get('value');
      }
      return prefix;
    });
  }
});
