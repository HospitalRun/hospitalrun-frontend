import Ember from 'ember';
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';
export default Ember.Mixin.create(PouchDbMixin, {
    findPatientVisits: true, //Override to false if visits shouldn't be set when patient is selected.    
    
    actions: {
        returnToPatient: function() {
            this.transitionToRoute('patients.edit', this.get('returnPatientId'));
        },        
        returnToVisit: function() {
            this.transitionToRoute('visits.edit', this.get('returnVisitId'));
        }
    },

    /**
     * Add the specified child to the current visit and then save the visit.  If a visit
     * has not been selected, create a new visit and add it to the selected patient.
     * @param {Object} objectToAdd the object to add.
     * @param {string} childName the name of the child object on the visit to add to.
     * @param {string} newVisitType if a new visit needs to be created, what type of visit
     * should be created. 
     * @returns {Promise} promise that will resolve or reject depending on whether or
     * not the add and subsequent saves were successful.
     */
    addChildToVisit: function(objectToAdd, childName, newVisitType) {
        return new Ember.RSVP.Promise(function(resolve, reject){
            var childPromises = [],
                patient = this.get('patient'),
                promises = [],
                visit = this.get('visit');
            if (Ember.isEmpty(visit)) {
                visit = this.get('store').createRecord('visit', {
                    startDate: new Date(),
                    endDate: new Date(),
                    outPatient: true,
                    patient: patient,
                    visitType: newVisitType
                });
                this.set('visit', visit);                            
            }
            childPromises.addObjects(this.resolveVisitChildren());
            Ember.RSVP.all(childPromises, 'Resolved visit children before adding new '+childName).then(function() {        
                visit.get(childName).then(function(visitChildren) {
                    visitChildren.addObject(objectToAdd);
                    promises.push(visit.save());
                    Ember.RSVP.all(promises, 'All updates done for visit add child object to '+childName).then(function() {        
                        resolve();
                    }.bind(this), reject);
                }.bind(this), reject);
            }.bind(this), reject);
        }.bind(this));
    },

    cancelAction: function() {
        var returnToPatient = this.get('returnToPatient'),
            returnToVisit = this.get('returnToVisit');
        if (returnToVisit) {
            return 'returnToVisit';
        } else if (returnToPatient) {
            return 'returnToPatient';
        } else {
            return 'allItems';
        }
    }.property('returnToPatient', 'returnToVisit'),
    
    patientId: Ember.computed.alias('patient.id'),
    
    patientChanged: function() {
        var maxValue = this.get('maxValue'),
            patient = this.get('patient'),
            patientId = 'patient_'+this.get('patientId');
        if (!Ember.isEmpty(patient) && this.get('findPatientVisits')) {
            this.store.find('visit', {
                options: {
                    startkey: [patientId, null, null, null, 'visit_'],
                    endkey: [patientId, maxValue, maxValue, maxValue, maxValue]
                },
                mapReduce: 'visit_by_patient'
            }).then(function(visits) {
                this.set('patientVisits',visits);
            }.bind(this));
        }
    }.observes('patient'),
    
    selectedPatientChanged: function() {
        var selectedPatient = this.get('selectedPatient');        
        if (!Ember.isEmpty(selectedPatient)) {
            this.store.find('patient', selectedPatient.id).then(function(item) {
                this.set('patient', item);
                Ember.run.once(this, function(){
                    this.get('model').validate();
                });
            }.bind(this));
        }
    }.observes('selectedPatient'),

    patientIdChanged: function() {
        var patientId = this.get('patientId');
        if (!Ember.isEmpty(patientId)) {
            this.set('returnPatientId', patientId);
        }
    }.observes('patientId').on('init'),        
    
    patientVisits: [],
    returnPatientId: null,
    returnVisitId: null,
    
    /**
     * Removes the specified child from the current visit object and then saves the visit.
     * @param {Object} objectToRemove the object to remove.
     * @param {string} childName the name of the child object on the visit to remove from.
     * @returns {Promise} promise that will resolve or reject depending on whether or
     * not the remove and subsequent save were successful.
     */    
    removeChildFromVisit: function(objectToRemove, childName) {
        return new Ember.RSVP.Promise(function(resolve, reject){
            var childPromises = [],
                visit = this.get('visit');
            childPromises.addObjects(this.resolveVisitChildren());
            Ember.RSVP.all(childPromises, 'Resolved visit children before removing '+childName).then(function() {
                visit.get(childName).then(function(visitChildren) {
                    visitChildren.removeObject(objectToRemove);                    
                    visit.save().then(resolve, reject);                
                }.bind(this), reject);
            }.bind(this), reject);
        }.bind(this));
    },
    
    /**
     * Observer on visits to make sure async relationships are resolved.
     * @returns {array} of promises which can be used to ensure
     * all relationships have resolved.
     */
    resolveVisitChildren: function() {        
        var promises = [],
            visit = this.get('visit');
        if (!Ember.isEmpty(visit)) {
            //Make sure all the async relationships are resolved    
            promises.push(visit.get('imaging'));
            promises.push(visit.get('labs'));
            promises.push(visit.get('medication'));
            promises.push(visit.get('procedures'));
            promises.push(visit.get('vitals'));            
        }
        return promises;
    },
    
    visitIdChanged: function() {
        var visitId = this.get('visitId');
        if (!Ember.isEmpty(visitId)) {
            this.set('returnVisitId', visitId);
        }
    }.observes('visitId').on('init'),
    
    visitId: Ember.computed.alias('visit.id'),
    visitsController: Ember.computed.alias('controllers.visits')
});