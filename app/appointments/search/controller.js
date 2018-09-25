import { isEmpty } from '@ember/utils';
import { alias } from '@ember/object/computed';
import { inject as controller } from '@ember/controller';
import AppointmentIndexController from 'hospitalrun/appointments/index/controller';
import AppointmentStatuses from 'hospitalrun/mixins/appointment-statuses';
import SelectValues from 'hospitalrun/utils/select-values';
import VisitTypes from 'hospitalrun/mixins/visit-types';
import { computed } from '@ember/object';

export default AppointmentIndexController.extend(AppointmentStatuses, VisitTypes, {
  appointmentsController: controller('appointments'),
  appointmentType: null,
  physicians: alias('appointmentsController.physicianList.value'),

  physicianList: computed('physicians', function() {
    return SelectValues.selectValues(this.get('physicians'), true);
  }),

  provider: null,
  queryParams: ['appointmentType', 'provider', 'status', 'startKey', 'startDate'],
  selectedProvider: null,
  selectedStatus: null,
  sortProperties: null,
  startDate: null,
  startKey: [],
  status: null,
  visitTypesList: alias('appointmentsController.visitTypesList'),

  actions: {
    search() {
      let appointmentType = this.get('model.selectedAppointmentType');
      let fieldsToSet = {
        startKey: [],
        previousStartKey: null,
        previousStartKeys: []
      };
      let provider = this.get('model.selectedProvider');
      let status = this.get('model.selectedStatus');
      let startDate = this.get('model.selectedStartingDate');

      if (isEmpty(appointmentType)) {
        fieldsToSet.appointmentType = null;
      } else {
        fieldsToSet.appointmentType = appointmentType;
      }
      if (isEmpty(provider)) {
        fieldsToSet.provider = null;
      } else {
        fieldsToSet.provider = provider;
      }
      if (isEmpty(status)) {
        fieldsToSet.status = null;
      } else {
        fieldsToSet.status = status;
      }
      if (!isEmpty(startDate)) {
        fieldsToSet.startDate = startDate.getTime();
      }
      if (!isEmpty(fieldsToSet)) {
        this.setProperties(fieldsToSet);
      }
    }
  }
});
