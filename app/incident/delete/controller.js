import { get } from '@ember/object';
import RSVP from 'rsvp';
import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import { translationMacro as t } from 'ember-i18n';

export default AbstractDeleteController.extend({
  title: t('incident.titles.deleteIncident'),

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
      let incident = get(this, 'model');
      this._deleteChildObject(incident, 'notes', destroyPromises);
      RSVP.all(destroyPromises).then(function() {
        // fires when all the destroys have been completed.
        get(this, 'model').destroyRecord().then(function() { // delete incident
          this.send('closeModal');
        }.bind(this));
      }.bind(this));
    }
  }
});
