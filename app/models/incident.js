import AbstractModel from "hospitalrun/models/abstract";
//import Ember from "ember";

export default AbstractModel.extend({
    friendlyId: DS.attr('string'),
	reportedBy: DS.attr('string'),
    reportedTo: DS.attr('string'),
	reportedDate: DS.attr('date'),
	locationOfIncident: DS.attr('string'),
	dateOfIncident: DS.attr('date'),
	incidentDescription: DS.attr('string'),
    
    categoryName: DS.attr('string'),
    categoryItem: DS.attr('string'),

    reviewers: DS.hasMany('inc-reviewer', {async: true}),
    feedbacks: DS.hasMany('inc-feedback', {async: true}),
    investigationFindings: DS.hasMany('inc-investigation-finding', {async: true}),
    
    patientContributingFactors: DS.hasMany('inc-contributing-factor', {async: true}),
   /* staffContributingFactors: DS.hasMany('inc-staff-factors', {async: true}),
    taskContributingFactors: DS.hasMany('inc-task-factors', {async: true}),
    communicationContributingFactors: DS.hasMany('inc-commn-factors', {async: true}),
    equipmentContributingFactors: DS.hasMany('inc-equip-factors', {async: true}),
    wrkEnvironmentContributingFactors: DS.hasMany('inc-envr-factors', {async: true}),
    organizationalContributingFactors: DS.hasMany('inc-org-factors', {async: true}),
    eduTrainingContributingFactors: DS.hasMany('inc-training-factors', {async: true}),
    teamContributingFactors: DS.hasMany('inc-team-factors', {async: true}),*/

    harmScore: DS.attr('string'),

    preSeverity: DS.attr('string'),
    preOccurence: DS.attr('string'),
    preRiskScore: DS.attr('string'),
    
    recommendations: DS.hasMany('inc-recommendation',  {async: true}),    
    
    postSeverity: DS.attr('string'),
    postOccurence: DS.attr('string'),
    postRiskScore: DS.attr('string'),
   

    incidentOpen: DS.attr('boolean', {defaultValue: true}),
    notificationSend: DS.attr('boolean', {defaultValue: false}),
    statusOfIncident: DS.attr('string',{
          defaultValue: function() { return 'Opened'; }
      })
    //severity : DS.attr()
    
    //
	//witnessList : DS.hasMany('witness', {async: true}),
	//documents : DS.hasMany('document', {async:true}),

    /*summary: function() {
        var summaryFields = this.getProperties('reportedBy', 'incidentDescription'),
            summary = '';
        for (var prop in summaryFields) {
            if (!Ember.isEmpty(summaryFields[prop])) {
                if (!Ember.isEmpty(summary)) {
                    summary += ', ';
                }
                summary += summaryFields[prop];
            }
        }
        return summary;
    }.property('reportedBy', 'incidentDescription')*/

});
