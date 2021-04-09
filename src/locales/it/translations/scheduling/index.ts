export default {
  scheduling: {
    label: 'Appuntamenti',
    appointments: {
      label: 'Appuntamenti',
      new: 'Nuovo appuntamento',
      schedule: 'Programma appuntamento',
      editAppointment: 'Modifica appuntamento',
      deleteAppointment: 'Cancella appuntamento',
      viewAppointment: 'Vedi appuntamento',
    },
    appointment: {
      startDate: 'Data di inizio',
      endDate: 'Data di fine',
      location: 'Luogo',
      type: 'Tipo',
      types: {
        checkup: 'Checkup',
        emergency: 'Emergenza',
        followUp: 'Approfondimento',
        routine: 'Routine',
        walkIn: 'Senza appuntamento',
      },
      errors: {
        patientRequired: 'Il paziente è obbligatorio.',
        errorCreatingAppointment: "Impossibile creare l'appuntamento!",
        startDateMustBeBeforeEndDate:
          'La data di inizio non può essere inferiore a quella di fine.',
      },
      reason: 'Motivo',
      patient: 'Paziente',
      deleteConfirmationMessage: "Sei sicuro di voler cancellare l'appuntamento?",
      successfullyCreated: 'Appuntamento creato con successo.',
    },
  },
}
