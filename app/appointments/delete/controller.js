import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';    
export default AbstractDeleteController.extend({
    title: 'Delete Appointment',
    
    afterDeleteAction: function() {
        var deleteFromPatient = this.get('deleteFromPatient');
        if (deleteFromPatient) {
            return 'appointmentDeleted';
        } else {
            return 'closeModal';
        }
    }.property('deleteFromPatient')
});