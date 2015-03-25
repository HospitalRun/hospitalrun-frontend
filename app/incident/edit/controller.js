import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from "ember";
import IncidentSubmodule from 'hospitalrun/mixins/incident-submodule';
import UserSession from "hospitalrun/mixins/user-session";

export default AbstractEditController.extend(IncidentSubmodule, UserSession, {
     needs: 'incident',
    
    canAddFeedback: function() {        
        return this.currentUserCan('add_feedback');
    }.property(),

    canAddInvestigationFinding: function() {
        return this.currentUserCan('add_investigation_finding');
    }.property(),    

    canAddContributingFactor: function() {        
        return this.currentUserCan('add_contributing_factor');
    }.property(),    
    
    canAddRecommendation: function() {        
        return this.currentUserCan('add_recommendation');
    }.property(),
    
	canAddRisk: function() {        
        return this.currentUserCan('add_risk');
    }.property(),    
	
    canDeleteFeedback: function() {        
        return this.currentUserCan('delete_feedback');
    }.property(),
    
    canDeleteInvestigationFinding: function() {
        return this.currentUserCan('delete_investigation_finding');
    }.property(),        
    
    canDeleteContributingFactor: function() {        
        return this.currentUserCan('delete_contributing_factor');
    }.property(),        
    
    canDeleteRecommendation: function() {        
        return this.currentUserCan('delete_recommendation');
    }.property(),

    canDeleteRisk: function() {        
        return this.currentUserCan('delete_risk');
    }.property(),
    
    cancelAction: 'returnToIncident',
	/*cancelAction: function() {
        var returnTo = this.get('returnTo');
        if (Ember.isEmpty(returnTo)) {
            return this._super();
        } else {
            return 'returnTo';
        }
    }.property('returnTo'),*/
	
    //cancelAction: 'incident.index',
    incidentCategoryNameList: Ember.computed.alias('controllers.incident.incidentCategoryNameList'),
    //incidentCategoryMainItemList: Ember.computed.alias('controllers.incident.incidentCategoryMainItemList'),
    
    lookupListsToUpdate: [{
        name: 'incidentCategoryNameList',
        property: 'name',
        id: 'incidentCategoryName_list'
    }],
    
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

    setAndGetReportedBy: function(){
        var incident = this.get('model');
        this.set('reportedBy', incident.getUserName());
         return this.get('reportedBy');
     }.property('reportedBy'),
    
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

        cancel: function() {
            var cancelledItem = this.get('model');
            if (this.get('isNew')) {
                cancelledItem.deleteRecord();
            } else {
                cancelledItem.rollback();
            }
            this.send(this.get('cancelAction'));
        },

        incidentCategoryNameList: [],

       /* newInvestigationFinding: function() {
            var newInvestigationFinding = this.get('store').createRecord('inc-investigation-finding', {
                //isCompleting: false,
                dateRecorded: new Date(),
                incident: this.get('model'),
                returnToIncident: true
            });            
            this.transitionToRoute('investigation-finding.edit', newInvestigationFinding);
        },

        editInvestigationFinding: function(lab) {
            lab.setProperties({
                'isCompleting': false,
                'returnToVisit': true
            });
            this.transitionToRoute('labs.edit', lab);
        }, */

         /*newFeedback: function() {
            var newFeedback = this.get('store').createRecord('inc-feedback', {
                dateRecorded: moment().startOf('day').toDate(),
                incident: this.get('model')
                //givenBy: (this.get('model')).getUserName();
                //returnToVisit: true
            });            
            this.transitionToRoute('feedback.edit', newFeedback);
        },*/
               
  
        addFeedback: function(newFeedback) {
            this.updateList('feedbacks', newFeedback);
        },

        showAddFeedback: function() {
            var newFeedback = this.get('store').createRecord('inc-feedback', {
                dateRecorded: new Date(),
                incident: this.get('model')
            });
            this.send('openModal', 'incident.feedback.edit', newFeedback);
        },        

        deleteFeedback: function(feedback) {
            this.updateList('feedbacks', feedback, true);
        },
        
        showDeleteFeedback: function(feedback) {
            this.send('openModal', 'incident.feedback.delete', feedback);
        },

        showEditFeedback: function(feedback) {
            this.send('openModal', 'incident.feedback.edit', feedback);
        },

        addInvestigationFinding: function(newInvestigationFinding) {
            this.updateList('investigationFindings', newInvestigationFinding);
        },

        showAddInvestigationFinding: function() {
            var newInvestigationFinding = this.get('store').createRecord('inc-investigation-finding', {
                dateRecorded: new Date(),
                incident: this.get('model')
            });
            this.send('openModal', 'incident.investigation-finding.edit', newInvestigationFinding);
        },        

        deleteInvestigationFinding: function(investigationFinding) {
            this.updateList('investigationFindings', investigationFinding, true);
        },
        
        showDeleteInvestigationFinding: function(investigationFinding) {
            this.send('openModal', 'incident.investigation-finding.delete', investigationFinding);
        },

        showEditInvestigationFinding: function(investigationFinding) {
            this.send('openModal', 'incident.investigation-finding.edit', investigationFinding);
        }


    /*
    
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
 
        showDeleteLab: function(lab) {
            this.send('openModal', 'labs.delete', lab);
        },
        
        showDeleteMedication: function(medication) {
            this.send('openModal', 'medication.delete', medication);
        },   
        
      
*/
       
    }
});
