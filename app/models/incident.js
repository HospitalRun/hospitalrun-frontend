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
    witnessList : DS.attr('string'),
    
    categoryName: DS.attr('string'),
    categoryItem: DS.attr('string'),

    reviewers: DS.hasMany('inc-reviewer', {async: true}),
    feedbacks: DS.hasMany('inc-feedback', {async: true}),
    investigationFindings: DS.hasMany('inc-investigation-finding', {async: true}),
    
    patientContributingFactors: DS.hasMany('inc-contributing-factor', {async: true}),
    staffContributingFactors: DS.hasMany('inc-contributing-factor', {async: true}),
    taskContributingFactors: DS.hasMany('inc-contributing-factor', {async: true}),
    communicationContributingFactors: DS.hasMany('inc-contributing-factor', {async: true}),
    equipmentContributingFactors: DS.hasMany('inc-contributing-factor', {async: true}),
    wrkEnvironmentContributingFactors: DS.hasMany('inc-contributing-factor', {async: true}),
    organizationalContributingFactors: DS.hasMany('inc-contributing-factor', {async: true}),
    eduTrainingContributingFactors: DS.hasMany('inc-contributing-factor', {async: true}),
    teamContributingFactors: DS.hasMany('inc-contributing-factor', {async: true}),

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
    showSummary: DS.attr('boolean', {defaultValue: false}),
    statusOfIncident: DS.attr('string',{
          defaultValue: function() { return 'Opened'; }
      })
    //severity : DS.attr()
    
    //
	//,
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
