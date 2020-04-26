export default {
  scheduling: {
    label: 'Agendamento',
    appointments: {
      label: 'Agendamantos',
      new: 'Novo Agendamento',
      schedule: 'Agenda de compromissos',
      editAppointment: 'Editar um compromisso',
      deleteAppointment: 'Eliminar um compromisso',
      viewAppointment: 'Ver um compromisso',
    },
    appointment: {
      startDate: 'Data de início',
      endDate: 'Data final',
      location: 'Localização',
      type: 'Tipo',
      types: {
        checkup: 'Checkup',
        emergency: 'Emergência',
        followUp: 'Acompanhamento',
        routine: 'Rotina',
        walkIn: 'Primeira consulta',
      },
      errors: {
        patientRequired: 'Paciente é necessario.',
        errorCreatingAppointment: 'Algo deu errado criando o agendamento.',
        startDateMustBeBeforeEndDate: 'Horário de início deve ser antes do horário final.',
      },
      reason: 'Razão',
      patient: 'Paciente',
      deleteConfirmationMessage: 'Tem a certeza de que deseja eliminar este compromisso?',
      successfullyCreated: 'Compromisso criado com sucesso',
    },
  },
}
