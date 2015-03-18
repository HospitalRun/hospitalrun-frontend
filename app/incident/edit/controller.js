import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from "ember";
import UserSession from "hospitalrun/mixins/user-session";

export default AbstractEditController.extend(UserSession, {
    needs: 'incident',
    
    canAddFeedback: function() {        
        return this.currentUserCan('add_feedback');
    }.property(),

    canAddInvestigationFindings: function() {
        return this.currentUserCan('add_investigation_findings');
    }.property(),    

    canAddContributingFactors: function() {        
        return this.currentUserCan('add_contributing_factors');
    }.property(),    
    
    canAddRecommendations: function() {        
        return this.currentUserCan('add_recommendations');
    }.property(),
    
	canAddRisk: function() {        
        return this.currentUserCan('add_risk');
    }.property(),    
	
    canDeleteFeedback: function() {        
        return this.currentUserCan('delete_feedback');
    }.property(),
    
    canDeleteInvestigationFindings: function() {
        return this.currentUserCan('delete_investigation_findings');
    }.property(),        
    
    canDeleteContributingFactors: function() {        
        return this.currentUserCan('delete_contributing_factors');
    }.property(),        
    
    canDeleteRecommendations: function() {        
        return this.currentUserCan('delete_recommendations');
    }.property(),

    canDeleteRisk: function() {        
        return this.currentUserCan('delete_risk');
    }.property(),
    
	cancelAction: function() {
        var returnTo = this.get('returnTo');
        if (Ember.isEmpty(returnTo)) {
            return this._super();
        } else {
            return 'returnTo';
        }
    }.property('returnTo'),
	
    //cancelAction: 'incident.index',
    /*clinicList: Ember.computed.alias('controllers.visits.clinicList'),
    pricingList: null, //This gets filled in by the route
    physicianList: Ember.computed.alias('controllers.visits.physicianList'),
    locationList: Ember.computed.alias('controllers.visits.locationList'),
    lookupListsToUpdate: [{
        name: 'clinicList',
        property: 'clinic',
        id: 'clinic_list'
    }, {
        name: 'physicianList',
        property: 'examiner',
        id: 'physician_list'
    }, {
        name: 'locationList',
        property: 'location',
        id: 'visit_location_list'
    }],*/
    
    newIncident: false,
    /*visitStatuses: [
        'Admitted',
        'Discharged'
    ],*/

    updateCapability: 'add_incident',

   /* primaryDiagnosisIdChanged: function() {
        this.get('model').validate();
    }.observes('primaryDiagnosisId'),*/

    afterUpdate: function() {
        this.displayAlert('Incident Saved', 'The Incident report has been saved.');
    },
    
    beforeUpdate: function() {        
        if (this.get('isNew')) {
            this.set('newIncident', true);
        }
        return Ember.RSVP.resolve();        
    },
    
    /**
     * Adds or removes the specified object from the specified list.
     * @param {String} listName The name of the list to operate on.
     * @param {Object} listObject The object to add or removed from the
     * specified list.
     * @param {boolean} removeObject If true remove the object from the list;
     * otherwise add the specified object to the list.
     */
    updateList: function(listName, listObject, removeObject) {
        this.get(listName).then(function(list) {
            if (removeObject) {
                list.removeObject(listObject);
            } else {
                list.addObject(listObject);
            }
            this.send('update', true);
            this.send('closeModal');
        }.bind(this));
    },
    
    actions: {
        /*addDiagnosis: function(newDiagnosis) {
            var additionalDiagnoses = this.get('additionalDiagnoses');
            if (!Ember.isArray(additionalDiagnoses)) {
                additionalDiagnoses = [];
            }
            additionalDiagnoses.addObject(newDiagnosis);
            this.set('additionalDiagnoses', additionalDiagnoses);
            this.send('update', true);
            this.send('closeModal');
        },
        
        deleteDiagnosis: function(diagnosis) {
            var additionalDiagnoses = this.get('additionalDiagnoses');
            additionalDiagnoses.removeObject(diagnosis);
            this.set('additionalDiagnoses', additionalDiagnoses);
            this.send('update', true);
        }, */
        cancel: function() {
            var cancelledItem = this.get('model');
            if (this.get('isNew')) {
                cancelledItem.deleteRecord();
            } else {
                cancelledItem.rollback();
            }
            this.send(this.get('cancelAction'));
        }
               
           /*
        addFeedbacks: function(newFeedbacks) {
            this.updateList('feedbacks', newFeedbacks);
        },

        showAddFeedbacks: function() {
            var newFeedbacks = this.get('store').createRecord('inc-feedback', {
                dateRecorded: new Date()
            });
            this.send('openModal', 'feedbacks.feedbacks.edit', newFeedbacks);
        },        

        deleteFeedbacks: function(feedbacks) {
            this.updateList('feedbacks', feedbacks, true);
        },


        showDeleteFeedbacks: function(feedbacks) {
            this.send('openModal', 'feedbacks.feedbacks.delete', feedbacks);
        },

        showEditFeedbacks: function(feedbacks) {
            this.send('openModal', 'feedbacks.feedbacks.edit', feedbacks);
        },

     

        addInvestigationFindings: function(newInvestigationFindings) {
            this.updateList('investigationFindings', newInvestigationFindings);
        },

        showAddInvestigationFindings: function() {
            var newInvestigationFindings = this.get('store').createRecord('investigation-finding', {
                dateRecorded: new Date()
            });
            this.send('openModal', 'investigationFindings.investigationFindings.edit', newInvestigationFindings);
        },        

        deleteInvestigationFindings: function(investigationFindings) {
            this.updateList('investigationFindings', investigationFindings, true);
        },


        showDeleteInvestigationFindings: function(investigationFindings) {
            this.send('openModal', 'investigationFindings.investigationFindings.delete', investigationFindings);
        },

        showEditInvestigationFindings: function(investigationFindings) {
            this.send('openModal', 'investigationFindings.investigationFindings.edit', investigationFindings);
        },

        addContributingFactors: function(newContributingFactors) {
            this.updateList('contributingFactors', newContributingFactors);
        },

        showAddContributingFactors: function() {
            var newContributingFactors = this.get('store').createRecord('contributing-factor', {
                dateRecorded: new Date()
            });
            this.send('openModal', 'contributingFactors.contributingFactors.edit', newContributingFactors);
        },        

        deleteContributingFactors: function(contributingFactors) {
            this.updateList('contributingFactors', contributingFactors, true);
        },

        showDeleteContributingFactors: function(contributingFactors) {
            this.send('openModal', 'contributingFactors.contributingFactors.delete', contributingFactors);
        },

        showEditContributingFactors: function(contributingFactors) {
            this.send('openModal', 'contributingFactors.contributingFactors.edit', contributingFactors);
        },

        addRecommendations: function(newRecommendations) {
            this.updateList('recommendations', newRecommendations);
        },

        showAddRecommendations: function() {
            var newRecommendations = this.get('store').createRecord('recommendation', {
                dateRecorded: new Date(),
                incident: this.get('model')
            });
            this.send('openModal', 'recommendations.recommendations.edit', newRecommendations);
        },        

        deleteRecommendations: function(recommendations) {
            this.updateList('recommendations', recommendations, true);
        },

        showDeleteRecommendations: function(recommendations) {
            this.send('openModal', 'recommendations.recommendations.delete', recommendations);
        },

        showEditRecommendations: function(recommendations) {
            this.send('openModal', 'recommendations.recommendations.edit', recommendations);
        },      
        
        editImaging: function(imaging) {
            imaging.setProperties({
                'isCompleting': false,
                'returnToVisit': true
            });
            this.transitionToRoute('imaging.edit', imaging);
        },        
        
        showDeleteImaging: function(imaging) {
            this.send('openModal', 'imaging.delete', imaging);
        },

        editMedication: function(medication) {
            medication.set('returnToVisit', true);
            this.transitionToRoute('medication.edit', medication);
        },        
        
        newImaging: function() {
            var newImaging = this.get('store').createRecord('imaging', {
                isCompleting: false,
                patient: this.get('patient'),
                visit: this.get('model'),
                returnToVisit: true
            });            
            this.transitionToRoute('imaging.edit', newImaging);
        },
     

        newMedication: function() {
            var newMedication = this.get('store').createRecord('medication', {
                prescriptionDate: moment().startOf('day').toDate(),
                patient: this.get('patient'),
                visit: this.get('model'),
                returnToVisit: true
            });            
            this.transitionToRoute('medication.edit', newMedication);
        },
        

     
        showDeleteLab: function(lab) {
            this.send('openModal', 'labs.delete', lab);
        },
        
        showDeleteMedication: function(medication) {
            this.send('openModal', 'medication.delete', medication);
        },   
        
      
*/
       
    }
});
