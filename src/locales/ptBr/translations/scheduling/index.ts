export default {
  scheduling: {
    label: "Agendamento",
    appointments: {
      label: "Agendamantos",
      new: "Novo Agendamento"
    },
    appointment: {
      startDate: "Data de início",
      endDate: "Data final",
      location: "Localização",
      type: "Tipo",
      types: {
        checkup: "Checkup",
        emergency: "Emergência",
        followUp: "Acompanhamento",
        routine: "Rotina",
        walkIn: "Primeira consulta"
      },
      errors: {
        patientRequired: "Paciente é necessario.",
        errorCreatingAppointment: "Algo deu errado criando o agendamento.",
        startDateMustBeBeforeEndDate: "Horário de início deve ser antes do horário final."
      },
      reason: "Razão",
      patient: "Paciente"
    }
  },
}
