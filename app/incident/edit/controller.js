import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from "ember";
import IncidentSubmodule from 'hospitalrun/mixins/incident-submodule';
import UserSession from "hospitalrun/mixins/user-session";
import IncidentCategoryList from "hospitalrun/mixins/incident-category";
import IncidentHarmScoreList from "hospitalrun/mixins/incident-harm-score";
import IncidentLocationsList from 'hospitalrun/mixins/incident-locations-list';
import IncidentContributingFactors from 'hospitalrun/mixins/incident-contributing-factors-classification';

export default AbstractEditController.extend(IncidentSubmodule, IncidentCategoryList, IncidentHarmScoreList, IncidentLocationsList,
 IncidentContributingFactors, UserSession, {
     needs: 'incident',
    
    canAddFeedback: function() {        
        return this.currentUserCan('add_feedback');
    }.property(),

    canAddReviewer: function() {        
        return this.currentUserCan('add_reviewer');
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

    canDeleteReviewer: function() {        
        return this.currentUserCan('delete_reviewer');
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

    
    severityTypes: [
        { 
          label: '5 Extreme Death, toxic release off-site with detrimental effect, huge financial loss',
          value: "Extreme 5"
        },
        {
          label: '4 High Extensive injuries, loss of production capability, off-site release with no detrimental effects, major financial loss',
          value: "High 4"

        },
        {
          label: '3 Moderate Medical treatment required, on-site release contained with outside assistance, high financial loss',
          value: "Moderate 3"

        },
        {
          label: '2 Low First aid treatment, on-site release contained, medium financial loss',
          value: "Low 2"

        },
        {
          label: '1 Minimum No injuries, low financial loss',
          value: "Minimum 1"

        }
    ],

    occurrenceTypes: [
        { 
          label: '5  Almost Certain  Is expected to occur in most circumstances (e.g. most weeks or months)',
          value: "Almost Certain 5"
        },
        {
          label: '4  Likely Will probably occur in most circumstances (several times a year)',
          value: "Likely 4"

        },
        {
          label: '3  Possible Might occur at some time (every 1 to 2 years)',
          value: "Possible 3"

        },
        {
          label: '2  Unlikely Could occur at some time (possibly in the next 2 to 5 years)',
          value: "Unlikely 2"

        },
        {
          label: '1  Rare May occur only in exceptional circumstances (perhaps every 5 to 30 years)',
          value: "Rare 1"

        }
    ],
    
    riskScores: [
        { 
          label: '15-25  : extreme risk; immediate action required',
          value: "extreme risk"
        },
        {
          label: '9-12   : high risk; senior management needed',
          value: "high risk"

        },
        {
          label: '4-8    : moderate risk; management responsibility must be specified',
          value: "moderate risk"

        },
        {
          label: '1-3    : low risk; manage by routine procedures',
          value: "low risk"

        }
        
    ],

    preSeverityTypes: [
        { 
          label: '5 Extreme Death, toxic release off-site with detrimental effect, huge financial loss',
          value: "Extreme 5"
        },
        {
          label: '4 High Extensive injuries, loss of production capability, off-site release with no detrimental effects, major financial loss',
          value: "High 4"

        },
        {
          label: '3 Moderate Medical treatment required, on-site release contained with outside assistance, high financial loss',
          value: "Moderate 3"

        },
        {
          label: '2 Low First aid treatment, on-site release contained, medium financial loss',
          value: "Low 2"

        },
        {
          label: '1 Minimum No injuries, low financial loss',
          value: "Minimum 1"

        }
    ],

    preOccurrenceTypes:  [
        { 
          label: '5  Almost Certain  Is expected to occur in most circumstances (e.g. most weeks or months)',
          value: "Almost Certain 5"
        },
        {
          label: '4  Likely Will probably occur in most circumstances (several times a year)',
          value: "Likely 4"

        },
        {
          label: '3  Possible Might occur at some time (every 1 to 2 years)',
          value: "Possible 3"

        },
        {
          label: '2  Unlikely Could occur at some time (possibly in the next 2 to 5 years)',
          value: "Unlikely 2"

        },
        {
          label: '1  Rare May occur only in exceptional circumstances (perhaps every 5 to 30 years)',
          value: "Rare 1"

        }
    ],

    preRiskScores: [
        { 
          label: '15-25  : extreme risk; immediate action required',
          value: "extreme risk"
        },
        {
          label: '9-12   : high risk; senior management needed',
          value: "high risk"

        },
        {
          label: '4-8    : moderate risk; management responsibility must be specified',
          value: "moderate risk"

        },
        {
          label: '1-3    : low risk; manage by routine procedures',
          value: "low risk"

        }
        
    ],

    incidentLocationsList: Ember.computed.alias('controllers.incident.incidentLocationsList.value'),
    
    //preSeverityTypes: Ember.computed.alias('controllers.incident.severityTypes'),
    //preOccurrenceTypes: Ember.computed.alias('controllers.incident.occurrenceTypes'),
    //preRiskScores: Ember.computed.alias('controllers.incident.riskScores'),


     incidentLocations: function() {
        var defaultIncidentLocations = this.get('defaultIncidentLocations'),
            incidentLocationsList = this.get('incidentLocationsList');
        if (Ember.isEmpty(incidentLocationsList)) {
            return defaultIncidentLocations;
        } else {
            return incidentLocationsList;
        }
    }.property('incidentLocationsList', 'defaultIncidentLocations'),

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
    
    newIncident: false,

    updateCapability: 'add_incident',

    afterUpdate: function() {
        if(this.get('statusOfIncident') === 'Opened'){
          this.set('statusOfIncident','Reported');
        }
        this.displayAlert('Incident Saved', 'The Incident report has been saved.');
    },
    
    beforeUpdate: function() {        
        if (this.get('isNew')) {
            this.set('newIncident', true);
        }
        return Ember.RSVP.resolve();        
    },

    setAndGetReportedBy: function(){
         this.set('reportedBy', this._getCurrentUserName());
         return this.get('reportedBy');
     }.property('reportedBy'),

     _getCurrentUserName: function(){
        var incident = this.get('model');
        return incident.getUserName(true);
     },

     _changeIncidentStatus: function(){
        var incidentStatus = this.get('statusOfIncident'),
            newStatus = null;
        if(incidentStatus === 'Reported'){
          newStatus = 'Active';
        }
        else if(incidentStatus === 'Active'){
          newStatus = 'Follow-up';
        }
        else if(incidentStatus === 'Follow-up'){
          newStatus = 'Close';
        }
      this.set('statusOfIncident', newStatus);
     },


     categoryNameChanged: function(){
        var categoryNameSelected = this.get('categoryName');
        if (!Ember.isEmpty(categoryNameSelected)) {
            var index = this._findIndexOfProperty(this.incidentCategory,'name',categoryNameSelected);
            this.set('itemList', this.incidentCategory[index].items);
        }
    }.observes('categoryName'),

    _findIndexOfProperty: function(arrayObj, property, value) {
        for(var i = 0; i < arrayObj.length; i += 1) {
            if(arrayObj[i][property] === value) {
            return i;
            }
        }
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

        cancel: function() {
            var cancelledItem = this.get('model');
            if (this.get('isNew')) {
                cancelledItem.deleteRecord();
            } else {
                cancelledItem.rollback();
            }
            this.send(this.get('cancelAction'));
        },

        //Feedback Functions

        addFeedback: function(newFeedback) {
            
            this.updateList('feedbacks', newFeedback);
        },

        showAddFeedback: function() {
            var newFeedback = this.get('store').createRecord('inc-feedback', {
                dateRecorded: new Date(),
                givenBy: this._getCurrentUserName()
                
                //incident: this.get('model')
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

        //Reviewers functions

        addReviewer: function(newReviewer) {
            this._changeIncidentStatus();
            this.updateList('reviewers', newReviewer);
        },

        showAddReviewer: function() {
            var newReviewer = this.get('store').createRecord('inc-reviewer', {
                dateRecorded: new Date(),
                addedBy: this._getCurrentUserName()
            });
            this.send('openModal', 'incident.reviewer.edit', newReviewer);
        },        

        deleteReviewer: function(reviewer) {
            this.updateList('reviewers', reviewer, true);
        },
        
        showDeleteReviewer: function(reviewer) {
            this.send('openModal', 'incident.reviewer.delete', reviewer);
        },

        showEditReviewer: function(reviewer) {
            this.send('openModal', 'incident.reviewer.edit', reviewer);
        },


        //Investigating Finding Functions

        addInvestigationFinding: function(newInvestigationFinding) {
            this.updateList('investigationFindings', newInvestigationFinding);
        },

        showAddInvestigationFinding: function() {
            var newInvestigationFinding = this.get('store').createRecord('inc-investigation-finding', {
                dateRecorded: new Date()
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
        },

        //Recommendation Functions

        addRecommendation: function(newRecommendation) {
            this._changeIncidentStatus();
            this.updateList('recommendations', newRecommendation);
        },

        showAddRecommendation: function() {
            var newRecommendation = this.get('store').createRecord('inc-recommendation', {
                dateRecorded: new Date()
            });
            this.send('openModal', 'incident.recommendation.edit', newRecommendation);
        },        

        deleteRecommendation: function(recommendation) {
            this.updateList('recommendations', recommendation, true);
        },
        
        showDeleteRecommendation: function(recommendation) {
            this.send('openModal', 'incident.recommendation.delete', recommendation);
        },

        showEditRecommendation: function(recommendation) {
            this.send('openModal', 'incident.recommendation.edit', recommendation);
        }

        
    }
});
