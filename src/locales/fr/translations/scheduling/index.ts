export default {
  scheduling: {
    label: 'Planning',
    appointments: {
      label: 'Rendez-vous',
      new: 'Nouveau rendez-vous',
      schedule: 'Planning des rendez-vous',
      editAppointment: 'Éditer un rendez-vous',
      deleteAppointment: 'Supprimer un rendez-vous',
    },
    appointment: {
      startDate: 'Date de début',
      endDate: 'Date de fin',
      location: 'Lieu',
      type: 'Type',
      types: {
        checkup: 'Bilan de santé',
        emergency: 'Urgence',
        followUp: 'Suivi',
        routine: 'Habituel',
        walkIn: 'Sans rendez-vous',
      },
      errors: {
        patientRequired: 'Le patient est requis.',
        errorCreatingAppointment: 'Erreur lors de la création du rendez-vous !',
        startDateMustBeBeforeEndDate: "La date de début doit être inférieur à l'heure de fin.",
      },
      reason: 'Raison',
      patient: 'Patient',
    },
  },
}
