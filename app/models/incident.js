import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';
import Ember from 'ember';
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

  preSeverity: DS.attr('number'),
  preOccurence: DS.attr('number'),
  preRiskScore: function() {
    if (Ember.isBlank(this.get('preSeverity')) || Ember.isBlank(this.get('preOccurence'))) {
      return undefined;
    } else {
      return this.get('preSeverity') * this.get('preOccurence');
    }
  }.property('preSeverity', 'preOccurence'),
  preRiskResults: function() {
    var score = this.get('preRiskScore');
    if (Ember.isBlank(score)) {
      return undefined;
    } else if (score <= 3) {
      return 'Low Risk: manage with routine procedures';
    } else if (score <= 8) {
      return 'Moderate Risk: management responsibility must be specified';
    } else if (score <= 12) {
      return 'High Risk: senior management needed';
    } else {
      return 'Extreme Risk: immediate action required';
    }
  }.property('preRiskScore'),

  recommendations: DS.hasMany('inc-recommendation',  { async: true }),
  lessonsLearned: DS.attr('string'),
  actionsTaken: DS.attr('string'),

  postSeverity: DS.attr('number'),
  postOccurence: DS.attr('number'),
  postRiskScore: function() {
    if (Ember.isBlank(this.get('postSeverity')) || Ember.isBlank(this.get('postOccurence'))) {
      return undefined;
    } else {
      return this.get('postSeverity') * this.get('postOccurence');
    }
  }.property('postSeverity', 'postOccurence'),
  postRiskResults: function() {
    var score = this.get('postRiskScore');
    if (Ember.isBlank(score)) {
      return undefined;
    } else if (score <= 3) {
      return 'Low Risk: manage with routine procedures';
    } else if (score <= 8) {
      return 'Moderate Risk: management responsibility must be specified';
    } else if (score <= 12) {
      return 'High Risk: senior management needed';
    } else {
      return 'Extreme Risk: immediate action required';
    }
  }.property('postRiskScore'),

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
