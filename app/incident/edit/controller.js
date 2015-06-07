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
     needs: ['incident','pouchdb'],

    canAddFeedback: function() {
         var currentUser = this._getCurrentUserName(),
             status = this.get('statusOfIncident'),
             canAdd = this.currentUserCan('add_feedback');
             this.get('reviewers').then(function(reviewers){
                reviewers.forEach(function(reviewer) {
                  if((currentUser === reviewer.get('reviewerEmail')) && (status !== 'Closed')){
                    canAdd = true;
                  }
                });
              });    
      return canAdd;
    }.property('reviewers.@each'),

    canEditFeedback: function() {
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

    canAddSummary: function() {        
        return this.currentUserCan('add_summary');
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

    patientContributingFactorsChanged: function() {
      this._reEnableCheckboxOnLoading('patientFactors','patientContributingFactors');
    }.observes('patientContributingFactors.@each'),

    staffContributingFactorsChanged: function() {
      this._reEnableCheckboxOnLoading('staffFactors','staffContributingFactors');
    }.observes('staffContributingFactors.@each'),

    taskContributingFactorsChanged: function() {
      this._reEnableCheckboxOnLoading('taskFactors','taskContributingFactors');
    }.observes('taskContributingFactors.@each'),

    communicationContributingFactorsChanged: function() {
      this._reEnableCheckboxOnLoading('communicationFactors','communicationContributingFactors');
    }.observes('communicationContributingFactors.@each'),

    equipmentContributingFactorsChanged: function() {
      this._reEnableCheckboxOnLoading('equipmentFactors','equipmentContributingFactors');
    }.observes('equipmentContributingFactors.@each'),

    wrkEnvironmentContributingFactorsChanged: function() {
      this._reEnableCheckboxOnLoading('workEnvFactors','wrkEnvironmentContributingFactors');
    }.observes('wrkEnvironmentContributingFactors.@each'),
    
    organizationalContributingFactorsChanged: function() {
      this._reEnableCheckboxOnLoading('organisationalFactors','organizationalContributingFactors');
    }.observes('organizationalContributingFactors.@each'),

    eduTrainingContributingFactorsChanged: function() {
      this._reEnableCheckboxOnLoading('educationAndTrainingFactors','eduTrainingContributingFactors');
    }.observes('eduTrainingContributingFactors.@each'),

    teamContributingFactorsChanged: function() {
      this._reEnableCheckboxOnLoading('teamFactors','teamContributingFactors');
    }.observes('teamContributingFactors.@each'),

    _reEnableCheckboxOnLoading: function(factorsList,contributingFactorsList){
      var factors = this.get(factorsList);
      this.get(contributingFactorsList).then(function(contributingFactors){
        factors.forEach(function(factor) {
            factor.components.forEach(function(component) {
                if (!Ember.isEmpty(contributingFactors.findBy('component', component.name))) {
                    this.set(component.id, true); //Check the checkbox by setting the checkbox value/property to true.
                }
            }.bind(this));
        }.bind(this));
      }.bind(this));
    },

    
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
    pouchdbController: Ember.computed.alias('controllers.pouchdb'),
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
    
    newIncident: false,

    updateCapability: 'add_incident',

    _completeBeforeUpdate: function(sequence, resolve, reject) {
        var sequenceValue = null,
            friendlyId = sequence.get('prefix'),
            promises = [];
        
        sequence.incrementProperty('value',1);
        sequenceValue = sequence.get('value');
        if (sequenceValue < 100000) {
            friendlyId += String('00000' + sequenceValue).slice(-5);
        } else {
            friendlyId += sequenceValue;
        }
        this.set('friendlyId', friendlyId);
        promises.push(sequence.save());
        Ember.RSVP.all(promises,'All before update done for Incident item').then(function(){
            resolve();
        }, function(error) {
            reject(error);
        });
    },

    _findSequence: function(type, resolve, reject) {
        var sequenceFinder = new Ember.RSVP.Promise(function(resolve){
            this._checkNextSequence(resolve, type, 0);
        }.bind(this));
        sequenceFinder.then(function(prefixChars) {
            var newSequence = this.get('store').push('sequence',{
                id: 'incident_'+type,
                prefix: type.toLowerCase().substr(0,prefixChars),
                value: 0
            });
            this._completeBeforeUpdate(newSequence, resolve, reject);
        }.bind(this));
    },
    
    _findSequenceByPrefix: function(type, prefixChars) {  
        var pouchdbController = this.get('pouchdbController');
        var sequenceQuery = {
            key:  type.toLowerCase().substr(0,prefixChars)            
        };
        return pouchdbController.queryMainDB(sequenceQuery, 'sequence_by_prefix');
    },    
    
    _checkNextSequence: function(resolve, type, prefixChars) {
        prefixChars++;
        this._findSequenceByPrefix(type, prefixChars).then(function(records) {
            if (Ember.isEmpty(records.rows)) {
                resolve(prefixChars);
            } else {
                this._checkNextSequence(resolve, type, prefixChars);
            }
        }.bind(this), function() {
            resolve(prefixChars);
        });        
    },
    
    afterUpdate: function() {
        if(this.get('statusOfIncident') === 'Opened'){
          this.set('statusOfIncident','Reported');
        }
        this.displayAlert('Incident Saved', 'The Incident report has been saved.');
    },
    
    beforeUpdate: function() {
        if (this.get('isNew')){
              this.set('newIncident', true);
              var type = 'incident';
              return new Ember.RSVP.Promise(function(resolve, reject){
                this.store.find('sequence', 'incident_'+type).then(function(sequence) {
                    this._completeBeforeUpdate(sequence, resolve, reject);
                }.bind(this), function() {
                    this._findSequence(type, resolve, reject);
                }.bind(this));
              }.bind(this));
        }
        else
        {
          //We need to return a promise because we need to ensure we have saved the inc-contributing-factor records first.
          return new Ember.RSVP.Promise(function(resolve, reject) {    
            var patientFactors = this.get('patientFactors'),
                savePromises = [];

            this.get('patientContributingFactors').then(function(patientContributingFactors){
                savePromises = this._addContributingFactors(patientFactors,patientContributingFactors);
            }.bind(this));

            var staffFactors = this.get('staffFactors');
            this.get('staffContributingFactors').then(function(staffContributingFactors){
                savePromises = this._addContributingFactors(staffFactors,staffContributingFactors);
            }.bind(this));

            var taskFactors = this.get('taskFactors');
            this.get('taskContributingFactors').then(function(taskContributingFactors){
                savePromises = this._addContributingFactors(taskFactors,taskContributingFactors);
            }.bind(this));

            var communicationFactors = this.get('communicationFactors');
            this.get('communicationContributingFactors').then(function(communicationContributingFactors){
                savePromises = this._addContributingFactors(communicationFactors,communicationContributingFactors);
            }.bind(this));

            var equipmentFactors = this.get('equipmentFactors');
            this.get('equipmentContributingFactors').then(function(equipmentContributingFactors){
                savePromises = this._addContributingFactors(equipmentFactors,equipmentContributingFactors);
            }.bind(this)); 

            var workEnvFactors = this.get('workEnvFactors');
            this.get('wrkEnvironmentContributingFactors').then(function(wrkEnvironmentContributingFactors){
                savePromises = this._addContributingFactors(workEnvFactors,wrkEnvironmentContributingFactors);
            }.bind(this));

            var organisationalFactors = this.get('organisationalFactors');
            this.get('organizationalContributingFactors').then(function(organizationalContributingFactors){
                savePromises = this._addContributingFactors(organisationalFactors,organizationalContributingFactors);
            }.bind(this));        
            
            var educationAndTrainingFactors = this.get('educationAndTrainingFactors');
            this.get('eduTrainingContributingFactors').then(function(eduTrainingContributingFactors){
                savePromises = this._addContributingFactors(educationAndTrainingFactors,eduTrainingContributingFactors);
            }.bind(this));

            var teamFactors = this.get('teamFactors');
            this.get('teamContributingFactors').then(function(teamContributingFactors){
                savePromises = this._addContributingFactors(teamFactors,teamContributingFactors);
            }.bind(this));

            Ember.RSVP.all(savePromises,'Updated contributing factor records before incident update').then(function(){
                resolve();
            }, function(error) {
                reject(error);
            });
          }.bind(this));
        }
    },

    setAndGetReportedBy: function(){
         this.set('reportedBy', this._getCurrentUserName());
         return this.get('reportedBy');
     }.property('reportedBy'),

     canShowSummary: function(){
        return this.get('showSummary');
     }.property('showSummary'),

     _getCurrentUserName: function(){
        var incident = this.get('model');
        return incident.getUserName(true);
     },

    havePatientContributingFactors: function() {
        var patientFactorsLength = this.get('patientContributingFactors.length');
        return (patientFactorsLength > 0);
    }.property('patientContributingFactors.length'),

    haveStaffContributingFactors: function() {
        var staffFactorsLength = this.get('staffContributingFactors.length');
        return (staffFactorsLength > 0);
    }.property('staffContributingFactors.length'),

    haveTaskContributingFactors: function() {
        var taskFactorsLength = this.get('taskContributingFactors.length');
        return (taskFactorsLength > 0);
    }.property('taskContributingFactors.length'),

    haveCommunicationContributingFactors: function() {
        var communicationFactorsLength = this.get('communicationContributingFactors.length');
        return (communicationFactorsLength > 0);
    }.property('communicationContributingFactors.length'),

    haveEquipmentContributingFactors: function() {
        var equipmentFactorsLength = this.get('equipmentContributingFactors.length');
        return (equipmentFactorsLength > 0);
    }.property('equipmentContributingFactors.length'),

    haveWorkEnvironmentContributingFactors: function() {
        var wrkEnvironmentFactorsLength = this.get('wrkEnvironmentContributingFactors.length');
        return (wrkEnvironmentFactorsLength > 0);
    }.property('wrkEnvironmentContributingFactors.length'),

    haveOrganizationalContributingFactors: function() {
        var organizationalFactorsLength = this.get('organizationalContributingFactors.length');
        return (organizationalFactorsLength > 0);
    }.property('organizationalContributingFactors.length'),

    haveEducationTrainingContributingFactors: function() {
        var eduTrainingFactorsLength = this.get('eduTrainingContributingFactors.length');
        return (eduTrainingFactorsLength > 0);
    }.property('eduTrainingContributingFactors.length'),

    haveTeamContributingFactors: function() {
        var teamFactorsLength = this.get('teamContributingFactors.length');
        return (teamFactorsLength > 0);
    }.property('teamContributingFactors.length'),


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

    _addContributingFactors: function(factorsList,contributingFactors){
         var savePromises = [],
                checkboxValue = null,
                existingFactor = null;
        factorsList.forEach(function(factor) {
                factor.components.forEach(function(component) {
                        checkboxValue = this.get(component.id);
                        existingFactor = contributingFactors.findBy('component', component.name);
                            if (Ember.isEmpty(checkboxValue)) {
                            //Checkbox isn't checked, delete from list if in list
                                if (!Ember.isEmpty(existingFactor)) {
                                contributingFactors.removeObject(existingFactor);
                                savePromises.push(existingFactor.destroyRecord());
                                }
                            } else {                    
                            if (Ember.isEmpty(existingFactor)) {
                              //Checkbox is checked, but value isn't stored on the model, so save it
                              existingFactor = this.store.createRecord('inc-contributing-factor', {
                                component: component.name,
                                type: factor.type
                              });
                              savePromises.push(existingFactor.save());
                              contributingFactors.addObject(existingFactor);
                            } 
                          }
                     
                }.bind(this));                
            }.bind(this));
            return savePromises;
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
            this.set('statusOfIncident', 'Active');
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
            this.set('statusOfIncident', 'Follow-up');
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
        },

        generateSummary: function(){
          this.set('statusOfIncident', 'Closed');
          this.set('showSummary', true);
        }        
    }
});
