import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';
import Ember from 'ember';
import IncidentStatuses, { REPORTED } from 'hospitalrun/mixins/incident-statuses';
import moment from 'moment';
import { validator } from 'ember-validations';

const { attr, belongsTo, hasMany } = DS;

const { computed, get, isEmpty } = Ember;

export default AbstractModel.extend(IncidentStatuses, {
  categoryItem: attr('string'),
  categoryName: attr('string'),
  dateOfIncident: attr('date'),
  department: attr('string'),
  description: attr('string'),
  friendlyId: attr('string'),
  modifiedByDisplayName: DS.attr('string'),
  notificationSend: attr('boolean', { defaultValue: false }),
  reportedBy: attr('string'),
  reportedByDisplayName: attr('string'),
  reportedDate: attr('date'),
  reportedTo: attr('string'),
  sentinelEvent: attr('boolean'),
  status: attr('string', { defaultValue: REPORTED }),

  incidentAttachments: hasMany('attachment', { async: true }),
  notes: hasMany('incident-note', { async: true }),
  patientImpacted: belongsTo('patient', { async: true }),

  dateForFilter: computed('dateOfIncident', function() {
    let dateOfIncident = get(this, 'dateOfIncident');
    return moment(dateOfIncident).startOf('day').toDate();
  }),

  localizedStatus: computed('status', function() {
    let status = get(this, 'status');
    return this.getLocalizedStatus(status);
  }),

  validations: {
    categoryName: {
      presence: true
    },
    dateOfIncident: {
      presence: true
    },
    department: {
      presence: true
    },
    description: {
      presence: true
    },
    patientTypeAhead: {
      inline: validator(function() {
        let patientTypeAhead = get(this, 'patientTypeAhead');
        let isValid = true;
        if (isEmpty(patientTypeAhead)) {
          return;
        }
        let patientName = get(this, 'patient.displayName');
        if (isEmpty(patientName)) {
          isValid = false;
        } else {
          let typeAheadName = patientTypeAhead.substr(0, patientName.length).toLowerCase();
          if (patientName.toLowerCase().indexOf(typeAheadName) !== 0) {
            isValid = false;
          }
        }
        if (!isValid) {
          let i18n = get(this, 'i18n');
          return i18n.t('incident.messages.selectExistingPatient').toString();
        }
      })
    }
  }
});
