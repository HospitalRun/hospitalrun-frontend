<<<<<<< HEAD
import Ember from 'ember';
export default Ember.Mixin.create({
  isUpdateDisabled: function() {
    if (!Ember.isNone(this.get('model.isValid'))) {
      return !this.get('model.isValid');
    } else {
      return false;
    }
  }.property('model.isValid')
});
=======
import { isNone } from '@ember/utils';
import Mixin from '@ember/object/mixin';
export default Mixin.create({
  isUpdateDisabled: function() {
    if (!isNone(this.get('model.isValid'))) {
      return !this.get('model.isValid');
    } else {
      return false;
    }
  }.property('model.isValid')
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
