export default {
  scheduling: {
    label: 'Planung',
    appointments: {
      label: 'Termine',
      new: 'Neuer Termin',
      schedule: 'Terminplan',
      editAppointment: 'Termin bearbeiten',
      deleteAppointment: 'Termin löschen',
      viewAppointment: 'Termin ansehen',
    },
    appointment: {
      startDate: 'Anfangsdatum',
      endDate: 'Enddatum',
      location: 'Standort',
      type: 'Typ',
      types: {
        checkup: 'Untersuchung',
        emergency: 'Notfall',
        followUp: 'Nachverfolgen',
        routine: 'Routine',
        walkIn: 'Walk In',
      },
      errors: {
        createAppointmentError: 'Neuer Termin konnte nicht erstellt werden.',
        updateAppointmentError: 'Termin konnte nicht aktualisiert werden.',
        patientRequired: 'Patient ist erforderlich.',
        startDateMustBeBeforeEndDate: 'Die Startzeit muss vor der Endzeit liegen.',
      },
      reason: 'Grund',
      patient: 'Patient',
      deleteConfirmationMessage: 'Sind Sie sicher, dass Sie diesen Termin löschen möchten?',
      successfullyCreated: 'Termin erfolgreich erstellt.',
      successfullyDeleted: 'Termin erfolgreich gelöscht.',
    },
  },
}
