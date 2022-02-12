export default {
  scheduling: {
    label: 'Horario',
    appointments: {
      label: 'Citas',
      new: 'Nueva cita',
      schedule: 'Programar cita',
      editAppointment: 'Editar cita',
      deleteAppointment: 'Borrar cita',
      viewAppointment: 'Ver cita',
    },
    appointment: {
      startDate: 'Comienzo',
      endDate: 'Fin',
      location: 'Lugar',
      type: 'Tipo',
      types: {
        checkup: 'Chequeo',
        emergency: 'Emergencia',
        followUp: 'Seguimiento',
        routine: 'Visita de rutina',
        walkIn: 'Sin cita',
      },
      errors: {
        patientRequired: 'Se neceista añadir un paciente',
        errorCreatingAppointment: 'Se ha producido un error al crear la cita',
        startDateMustBeBeforeEndDate: 'La cita debe comenzar antes del fin',
      },
      reason: 'Motivo',
      patient: 'Paciente',
      deleteConfirmationMessage: '¿Estás seguro que quieres borrar la cita?',
      successfullyCreated: 'Se ha creado la cita exitosamente.',
    },
  },
}
