import AppointmentIndexController from 'hospitalrun/appointments/index/controller';
import AppointmentStatuses from 'hospitalrun/mixins/appointment-statuses';
import Ember from 'ember';
import SelectValues from 'hospitalrun/utils/select-values';
import VisitTypes from 'hospitalrun/mixins/visit-types';
export default AppointmentIndexController.extend(AppointmentStatuses, VisitTypes, {
  needs: 'appointments',
  appointmentType: null,
  physicianList: Ember.computed.map('controllers.appointments.physicianList.value', SelectValues.selectValuesMap),

  provider: null,
  queryParams: ['appointmentType', 'provider', 'status', 'startKey', 'startDate'],
  searchFields: ['selectedAppointmentType', 'selectedProvider', 'selectedStatus', 'selectedStartDate'],
  selectedProvider: null,
  selectedStartingDate: new Date(),
  selectedStatus: null,
  sortProperties: null,
  startKey: [],
  status: null,
  visitTypesList: Ember.computed.alias('controllers.appointments.visitTypeList'),

  actions: {
    search: function () {
      var appointmentType = this.get('selectedAppointmentType'),
        fieldsToSet = {
          startKey: [],
          previousStartKey: null,
          previousStartKeys: []
        },
        provider = this.get('selectedProvider'),
        status = this.get('selectedStatus'),
        startDate = this.get('selectedStartingDate');

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
