import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
import UserSession from 'hospitalrun/mixins/user-session';
import { translationMacro as t } from 'ember-i18n';

export default AbstractModuleRoute.extend(UserSession, {
  addCapability: 'add_appointment',
  allowSearch: false,
  currentScreenTitle: t('appointments.current_screen_title'),
  editTitle: t('appointments.edit_title'),
  newTitle: t('appointments.new_title'),
  moduleName: 'appointments',
  newButtonText: t('appointments.buttons.new_button'),
  sectionTitle: t('appointments.section_title'),

  actions: {
    createVisit: function(appointment) {
      var visitProps = appointment.getProperties('startDate', 'endDate', 'location', 'patient');
      visitProps.visitType = appointment.get('appointmentType');
      visitProps.examiner = appointment.get('provider');
      this.transitionTo('visits.edit', 'new').then(function(newRoute) {
        newRoute.currentModel.setProperties(visitProps);
      }.bind(this));
    }
  },

  additionalModels: [{
    name: 'physicianList',
    findArgs: ['lookup', 'physician_list']
  }, {
    name: 'locationList',
    findArgs: ['lookup', 'visit_location_list']
  }, {
    name: 'visitTypesList',
    findArgs: ['lookup', 'visit_types']
  }]
});
