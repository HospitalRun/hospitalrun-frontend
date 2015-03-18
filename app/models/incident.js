import AbstractModel from "hospitalrun/models/abstract";
//import Ember from "ember";

export default AbstractModel.extend({
	feedbacks: DS.hasMany('inc-feedback', {async: true}),
    investigationFindings: DS.hasMany('inc-investigation-finding', {async: true}),
    contributingFactors: DS.hasMany('inc-contributing-factor',  {async: true}),
    recommendations: DS.hasMany('inc-recommendation',  {async: true}),
    
    risk: DS.belongsTo('inc-risk'),
    incidentMedicalCategory: DS.belongsTo('inc-medical-category'),
    
    friendlyId: DS.attr('string'),
	reportedBy: DS.attr('string'),
	reportedDate: DS.attr('date'),
	locationOfIncident: DS.attr('string'),
	dateOfIncident: DS.attr('date'),
	timeOfIncident: DS.attr('string'),
	incidentDescription: DS.attr('string'),
    
    openFlag: DS.attr('boolean', {defaultValue: true})
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
