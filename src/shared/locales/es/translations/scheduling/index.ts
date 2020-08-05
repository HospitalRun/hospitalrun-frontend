export default {
  scheduling: {
    label: 'Agenda',
    appointments: {
      label: 'Citas',
      new: 'Nueva cita',
      schedule: 'Ver agenda',
      editAppointment: 'Modificar cita',
      deleteAppointment: 'Borrar cita',
      viewAppointment: 'Ver cita',
    },
    appointment: {
      startDate: 'Fecha desde',
      endDate: 'Fecha hasta',
      location: 'Ubicación',
      type: 'Tipo',
      types: {
        checkup: 'Revisión',
        emergency: 'Emergencia',
        followUp: 'Control',
        routine: 'Rutina',
        walkIn: 'Admisión',
      },
      errors: {
        createAppointmentError: 'No se pudo crear la cita.',
        updateAppointmentError: 'No se pudo actualizar la cita.',
        patientRequired: 'Se requiere un paciente.',
        startDateMustBeBeforeEndDate: 'Fecha inicial debe ser previa a la fecha final.',
      },
      reason: 'Motivo',
      patient: 'Paciente',
      deleteConfirmationMessage: '¿Estas seguro que deseas borrar esta cita?',
      successfullyCreated: 'Cita creada exitosamente.',
      successfullyDeleted: 'Cita borrada exitosamente.',
    },
  },
}
