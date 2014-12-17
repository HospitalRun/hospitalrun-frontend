import Ember from "ember";
export default Ember.Mixin.create({
    actions: {
        returnToPatient: function() {
            this.transitionToRoute('patients.edit', this.get('returnPatientId'));
        },        
        returnToVisit: function() {
            this.transitionToRoute('visits.edit', this.get('returnVisitId'));
        }
    },

    /**
     * Add the specified child to the specified visit.  If a visit
     * has not been selected, create a new visit and add it to the selected patient.
     * @param {Object} objectToAdd the object to add.
     * @param {string} the name of the child object on visit to add to.
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
    
    patientIdChanged: function() {
        var patientId = this.get('patientId');
        if (!Ember.isEmpty(patientId)) {
            this.set('returnPatientId', patientId);
        }
    }.observes('patientId').on('init'),
    
    patientVisits: function() {
        var patientId = this.get('patientId'),
            visitList = this.get('visitList');    
        if (!Ember.isEmpty(visitList)) {
            return visitList.filterBy('patient.id', patientId);
        }
    }.property('patientId'),
    
    returnPatientId: null,
    returnVisitId: null,    
    
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
    }.observes('visit'),    

    visitIdChanged: function() {
        var visitId = this.get('visitId');
        if (!Ember.isEmpty(visitId)) {
            this.set('returnVisitId', visitId);
        }
    }.observes('visitId').on('init'),
    
    visitId: Ember.computed.alias('visit.id'),
    visitsController: Ember.computed.alias('controllers.visits')
});