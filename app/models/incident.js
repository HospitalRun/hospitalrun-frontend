import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';

export default AbstractModel.extend({
  friendlyId: DS.attr('string'),
  reportedBy: DS.attr('string'),
  reportedTo: DS.attr('string'),
  reportedDate: DS.attr('date'),
  locationOfIncident: DS.attr('string'),
  dateOfIncident: DS.attr('date'),
  witnessList: DS.attr('string'),
  incidentDescription: DS.attr('string'),

  categoryName: DS.attr('string'),
  categoryItem: DS.attr('string'),
  categoryOther: DS.attr('string'),

  reviewers: DS.hasMany('inc-reviewer', { async: true }),
  feedbacks: DS.hasMany('inc-feedback', { async: true }),
  investigationFindings: DS.hasMany('inc-investigation-finding', { async: true }),

  patientContributingFactors: DS.hasMany('inc-contributing-factor', { async: true }),
  staffContributingFactors: DS.hasMany('inc-contributing-factor', { async: true }),
  taskContributingFactors: DS.hasMany('inc-contributing-factor', { async: true }),
  communicationContributingFactors: DS.hasMany('inc-contributing-factor', { async: true }),
  equipmentContributingFactors: DS.hasMany('inc-contributing-factor', { async: true }),
  wrkEnvironmentContributingFactors: DS.hasMany('inc-contributing-factor', { async: true }),
  organizationalContributingFactors: DS.hasMany('inc-contributing-factor', { async: true }),
  eduTrainingContributingFactors: DS.hasMany('inc-contributing-factor', { async: true }),
  teamContributingFactors: DS.hasMany('inc-contributing-factor', { async: true }),
  rcaSummary: DS.attr('string'),

  harmScore: DS.attr('string'),
  harmDuration: DS.attr('string'),

  preSeverity: DS.attr('string'),
  preOccurence: DS.attr('string'),
  preRiskScore: DS.attr('string'),

  recommendations: DS.hasMany('inc-recommendation',  { async: true }),
  lessonsLearned: DS.attr('string'),
  actionsTaken: DS.attr('string'),

  postSeverity: DS.attr('string'),
  postOccurence: DS.attr('string'),
  postRiskScore: DS.attr('string'),

  incidentOpen: DS.attr('boolean', { defaultValue: true }),
  notificationSend: DS.attr('boolean', { defaultValue: false }),
  showSummary: DS.attr('boolean', { defaultValue: false }),
  statusOfIncident: DS.attr('string', {
    defaultValue: function() {
      return 'Opened';
    }
  }),

  validations: {

    locationOfIncident: {
      presence: true
    },
    dateOfIncident: {
      presence: true
    },
    reportedTo: {
      presence: true
    },
    incidentDescription: {
      presence: true
    },
    categoryName: {
      presence: true
    },
    categoryItem: {
      presence: true
    }
  }
});
