import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';
export default AbstractDeleteController.extend({
  title: t('incident.titles.delete_item'),

  _deleteChildObject: function(incident, childObject, destroyPromises) {
    incident.get(childObject).then(function(childObject) {
        childObject.forEach(function(child) {
          destroyPromises.push(child.destroyRecord());  // Add the destroy promise to the list
        });
      });
  },

  actions: {
    delete: function() {
      var destroyPromises = [];
      var incident = this.get('model');
      this._deleteChildObject(incident, 'reviewers', destroyPromises);
      this._deleteChildObject(incident, 'feedbacks', destroyPromises);
      this._deleteChildObject(incident, 'investigationFindings', destroyPromises);
      this._deleteChildObject(incident, 'patientContributingFactors', destroyPromises);
      this._deleteChildObject(incident, 'staffContributingFactors', destroyPromises);
      this._deleteChildObject(incident, 'taskContributingFactors', destroyPromises);
      this._deleteChildObject(incident, 'communicationContributingFactors', destroyPromises);
      this._deleteChildObject(incident, 'equipmentContributingFactors', destroyPromises);
      this._deleteChildObject(incident, 'wrkEnvironmentContributingFactors', destroyPromises);
      this._deleteChildObject(incident, 'organizationalContributingFactors', destroyPromises);
      this._deleteChildObject(incident, 'eduTrainingContributingFactors', destroyPromises);
      this._deleteChildObject(incident, 'teamContributingFactors', destroyPromises);
      this._deleteChildObject(incident, 'recommendations', destroyPromises);
      Ember.RSVP.all(destroyPromises).then(function() {
        // fires when all the destroys have been completed.
        this.get('model').destroyRecord().then(function() { // delete incident
          this.send('closeModal');
        }.bind(this));
      }.bind(this));
    }
  }
});
