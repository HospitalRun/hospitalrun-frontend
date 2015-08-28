import Ember from 'ember';
import PatientVisits from 'hospitalrun/mixins/patient-visits';
export default Ember.Mixin.create(PatientVisits, {
    findPatientVisits: true, //Override to false if visits shouldn't be set when patient is selected.    
    needToUpdateVisit: false,
    patientList: null,
    selectedPatient: null,
    
    actions: {
        showPatient: function(patient) {
            this.transitionToRoute('patients.edit', patient);
        },        
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
            var visit = this.get('model.visit');
            if (Ember.isEmpty(visit)) {
                visit = this.createNewVisit(newVisitType).then(function(savedVisit) {
                    this._finishAddChildToVisit(objectToAdd, childName, savedVisit, resolve, reject);
                }.bind(this), reject);
            } else {
                this._finishAddChildToVisit(objectToAdd, childName, visit, resolve, reject);
            }
        }.bind(this));
    },
    
    _finishAddChildToVisit: function(objectToAdd, childName, visit, resolve, reject) {
        visit.get(childName).then(function(visitChildren) {
            visitChildren.addObject(objectToAdd);
            this.set('needToUpdateVisit', true);
            resolve(objectToAdd);
        }.bind(this), reject);
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
    
    createNewVisit: function(newVisitType) {
        return new Ember.RSVP.Promise(function(resolve, reject){
            var model = this.get('model'),
                patient = model.get('patient'),
                visit = this.get('store').createRecord('visit', {
                startDate: new Date(),
                endDate: new Date(),
                outPatient: true,
                patient: patient,
                visitType: newVisitType
            });
            model.set('visit', visit);
            visit.save().then(function() {
                visit.reload().then(function(updatedVisit) {
                    this.getPatientVisits(patient).then(function(visits) {
                        this.set('patientVisits',visits);
                        model.set('visit', updatedVisit);
                        resolve(updatedVisit);
                    }.bind(this),reject);
                }.bind(this), reject);
            }.bind(this), reject).catch(function(err) {
                console.log("Error creating new visit");
                reject(err);
            }.bind(this));
        }.bind(this));
    },

    patientId: Ember.computed.alias('model.patient.id'),
    
    patientChanged: function() {
        var patient = this.get('model.patient');
        if (!Ember.isEmpty(patient) && this.get('findPatientVisits')) {
            this.getPatientVisits(patient).then(function(visits) {
                this.set('patientVisits',visits);
            }.bind(this));
        }
    }.observes('model.patient'),
    
    selectedPatientChanged: function() {
        var selectedPatient = this.get('selectedPatient');        
        if (!Ember.isEmpty(selectedPatient)) {
            this.store.find('patient', selectedPatient.id).then(function(item) {
                this.set('model.patient', item);
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
                visit = this.get('model.visit');
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
            visit = this.get('model.visit');
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
    
    /**
     * If visit needs to saved, save it and then display an alert message; otherwise
     * just display the alert message.
     * @param alertTitle String the title to use on the alert.
     * @param alertMessage String the message to display in the alert.
     */
    saveVisitIfNeeded: function(alertTitle, alertMessage, alertAction) {
        if (this.get('needToUpdateVisit')) {
            this.get('model.visit').save().then(function() {
                this.set('needToUpdateVisit', false);
                this.displayAlert(alertTitle, alertMessage, alertAction);    
            }.bind(this));
        } else {
            this.displayAlert(alertTitle, alertMessage, alertAction);    
        }
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