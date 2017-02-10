import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';
export default AbstractDeleteController.extend({
  title: t('incident.titles.deleteItem'),

  _deleteChildObject(incident, childObject, destroyPromises) {
    incident.get(childObject).then(function(childObject) {
      childObject.forEach(function(child) {
        destroyPromises.push(child.destroyRecord());  // Add the destroy promise to the list
      });
    });
  },

  actions: {
    delete() {
      let destroyPromises = [];
      let incident = this.get('model');
      this._deleteChildObject(incident, 'notes', destroyPromises);
      Ember.RSVP.all(destroyPromises).then(function() {
        // fires when all the destroys have been completed.
        this.get('model').destroyRecord().then(function() { // delete incident
          this.send('closeModal');
        }.bind(this));
      }.bind(this));
    }
  }
});
