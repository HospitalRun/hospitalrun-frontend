<<<<<<< HEAD
import Ember from 'ember';
export default Ember.Mixin.create({
  cancelAction: function() {
    let returnTo = this.get('model.returnTo');
    if (Ember.isEmpty(returnTo)) {
      return 'allItems';
    } else {
      return 'returnTo';
    }
  }.property('returnTo')
});
=======
import { isEmpty } from '@ember/utils';
import Mixin from '@ember/object/mixin';
export default Mixin.create({
  cancelAction: function() {
    let returnTo = this.get('model.returnTo');
    if (isEmpty(returnTo)) {
      return 'allItems';
    } else {
      return 'returnTo';
    }
  }.property('returnTo')
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
