export default {
  scheduling: {
    label: 'Scheduling',
    appointments: {
      label: 'Appointments',
      new: 'New Appointment',
      deleteAppointment: 'Delete Appointment',
      viewAppointment: 'Appointment',
      editAppointment: 'Edit Appointment',
    },
    appointment: {
      startDate: 'Start Date',
      endDate: 'End Date',
      location: 'Location',
      type: 'Type',
      types: {
        checkup: 'Checkup',
        emergency: 'Emergency',
        followUp: 'Follow Up',
        routine: 'Routine',
        walkIn: 'Walk In',
      },
      successfullyCreated: 'Appointment successfully created.',
      errors: {
        patientRequired: 'Patient is required.',
        errorCreatingAppointment: 'Error Creating Appointment!',
        startDateMustBeBeforeEndDate: 'Start Time must be before End Time.',
      },
      reason: 'Reason',
      patient: 'Patient',
      successfullyDeleted: 'Appointment successfully deleted.',
      deleteConfirmationMessage: 'Are you sure you want to delete this appointment?',
    },
  },
}
