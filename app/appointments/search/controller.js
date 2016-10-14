import AppointmentIndexController from 'hospitalrun/appointments/index/controller';
import AppointmentStatuses from 'hospitalrun/mixins/appointment-statuses';
import Ember from 'ember';
import SelectValues from 'hospitalrun/utils/select-values';
import VisitTypes from 'hospitalrun/mixins/visit-types';
export default AppointmentIndexController.extend(AppointmentStatuses, VisitTypes, {
  appointmentsController: Ember.inject.controller('appointments'),
  appointmentType: null,
  physicians: Ember.computed.alias('appointmentsController.physicianList.value'),
  physicianList: function() {
    return SelectValues.selectValues(this.get('physicians'), true);
  }.property('physicians'),

  provider: null,
  queryParams: ['appointmentType', 'provider', 'status', 'startKey', 'startDate'],
  selectedProvider: null,
  selectedStatus: null,
  sortProperties: null,
  startDate: null,
  startKey: [],
  status: null,
  visitTypesList: Ember.computed.alias('appointmentsController.visitTypesList'),

  actions: {
    search: function() {
      let appointmentType = this.get('model.selectedAppointmentType');
      let fieldsToSet = {
          startKey: [],
          previousStartKey: null,
          previousStartKeys: []
        };
      let provider = this.get('model.selectedProvider');
      let status = this.get('model.selectedStatus');
      let startDate = this.get('model.selectedStartingDate');

      if (Ember.isEmpty(appointmentType)) {
        fieldsToSet.appointmentType = null;
      } else {
        fieldsToSet.appointmentType = appointmentType;
      }
      if (Ember.isEmpty(provider)) {
        fieldsToSet.provider = null;
      } else {
        fieldsToSet.provider = provider;
      }
      if (Ember.isEmpty(status)) {
        fieldsToSet.status = null;
      } else {
        fieldsToSet.status = status;
      }
      if (!Ember.isEmpty(startDate)) {
        fieldsToSet.startDate = startDate.getTime();
      }
      if (!Ember.isEmpty(fieldsToSet)) {
        this.setProperties(fieldsToSet);
      }
    }
  }
});
