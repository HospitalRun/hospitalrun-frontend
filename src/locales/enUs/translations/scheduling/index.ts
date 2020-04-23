export default {
  scheduling: {
    label: 'Scheduling',
    appointments: {
      label: 'Appointments',
      new: 'New Appointment',
      schedule: 'Appointment Schedule',
      editAppointment: 'Edit Appointment',
      deleteAppointment: 'Delete Appointment',
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
      errors: {
        patientRequired: 'Patient is required.',
        errorCreatingAppointment: 'Error Creating Appointment!',
        startDateMustBeBeforeEndDate: 'Start Time must be before End Time.',
      },
      reason: 'Reason',
      patient: 'Patient',
    },
  },
}
