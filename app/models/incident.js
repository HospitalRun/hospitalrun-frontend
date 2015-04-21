import AbstractModel from "hospitalrun/models/abstract";
//import Ember from "ember";

export default AbstractModel.extend({
    friendlyId: DS.attr('string'),
	reportedBy: DS.attr('string'),
	reportedDate: DS.attr('date'),
	locationOfIncident: DS.attr('string'),
	dateOfIncident: DS.attr('date'),
	timeOfIncident: DS.attr('string'),
	incidentDescription: DS.attr('string'),
    categoryName: DS.attr('string'),
    categoryItem: DS.attr('string'),

    feedbacks: DS.hasMany('inc-feedback', {async: true}),
    investigationFindings: DS.hasMany('inc-investigation-finding', {async: true}),
    recommendations: DS.hasMany('inc-recommendation',  {async: true}),
    
    patientContributingFactor: DS.attr('string'),
    individualContributingFactor: DS.attr('string'),
    taskContributingFactor: DS.attr('string'),
    communicationContributingFactor: DS.attr('string'),
    teamContributingFactor: DS.attr('string'),
    workingConditionContributingFactor: DS.attr('string'),
    organizationalContributingFactor: DS.attr('string'),
    
    harmScore: DS.attr('string'),
 
    preSeverity: DS.attr('string'),
    preOccurence: DS.attr('string'),
    preRiskScore: DS.attr('string'),

    postSeverity: DS.attr('string'),
    postOccurence: DS.attr('string'),
    postRiskScore: DS.attr('string'),
   

    incidentOpen: DS.attr('boolean', {defaultValue: true}),
    notificationSend: DS.attr('boolean', {defaultValue: false})
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
