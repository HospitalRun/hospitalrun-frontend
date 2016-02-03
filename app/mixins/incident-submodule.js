import Ember from 'ember';
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';
export default Ember.Mixin.create(PouchDbMixin, {
  actions: {
    returnToIncident: function() {
      this.transitionToRoute('incident.edit', this.get('returnIncidentId'));
    }
  },

  /**
   * Add the specified child to the specified incident.
   If a incident has not been selected, create a new incident and add it to the selected - CANNOT HAPPEN ??-NOT NEEDED.
   * @param {Object} objectToAdd the object to add.
   * @param {string} the name of the child object on incident to add to.
   * @returns {Promise} promise that will resolve or reject depending on whether or
   * not the add and subsequent saves were successful.
   */
  addChildToIncident: function(objectToAdd, childName) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var childPromises = [],
          promises = [],
          incident = this.get('incident');
      /*if (Ember.isEmpty(incident)) {
          incident = this.get('store').createRecord('incident', {
          });
          this.set('incident', incident);
      }*/
      childPromises.addObjects(this.resolveIncidentChildren());
      Ember.RSVP.all(childPromises, 'Resolved Incident children before adding new ' + childName).then(function() {
        incident.get(childName).then(function(incidentChildren) {
          incidentChildren.addObject(objectToAdd);
          promises.push(incident.save());
          Ember.RSVP.all(promises, 'All updates done for incident add child object to ' + childName).then(function() {
            resolve();
          }.bind(this), reject);
        }.bind(this), reject);
      }.bind(this), reject);
    }.bind(this));
  },

  cancelAction: function() {
    var returnToIncident = this.get('returnToIncident');
    if (returnToIncident) {
      return 'returnToIncident';
    } else {
      return 'allItems';
    }
  }.property('returnToIncident'),

  returnIncidentId: null,

  /**
   * Observer on Incident to make sure async relationships are resolved.
   * @returns {array} of promises which can be used to ensure
   * all relationships have resolved.
   */
  resolveIncidentChildren: function() {
    var promises = [],
        incident = this.get('incident');
    if (!Ember.isEmpty(incident)) {
      // Make sure all the async relationships are resolved
      promises.push(incident.get('feedbacks'));
      promises.push(incident.get('investigationFindings'));
      promises.push(incident.get('contributingFactors'));
      promises.push(incident.get('recommendations'));
    }
    return promises;
  },

  incidentChanged: function() {
    this.resolveIncidentChildren();
  }.observes('incident'),

  incidentIdChanged: function() {
    var incidentId = this.get('incidentId');
    if (!Ember.isEmpty(incidentId)) {
      this.set('returnIncidentId', incidentId);
    }
  }.observes('incidentId').on('init'),

  incidentId: Ember.computed.alias('incident.id'),
  incidentController: Ember.computed.alias('controllers.incident')
});
