import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
export default AbstractDeleteController.extend({
  title: 'Delete Appointment',

  afterDeleteAction: function() {
    let deleteFromPatient = this.get('model.deleteFromPatient');
    if (deleteFromPatient) {
      return 'appointmentDeleted';
    } else {
      return 'closeModal';
    }
  }.property('model.deleteFromPatient')
});
