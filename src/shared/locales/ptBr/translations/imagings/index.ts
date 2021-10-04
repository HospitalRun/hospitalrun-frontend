export default {
  imagings: {
    label: 'Imagens',
    status: {
      requested: 'Solicitado',
      completed: 'Concluído',
      canceled: 'Cancelado',
    },
    requests: {
      label: 'Solicitação de Imagens',
      new: 'Nova requisição de Imagem',
      view: 'Visualizar Imagem',
      create: 'Solicitar Imagem',
      cancel: 'Cancelar Imagem',
      complete: 'Finalizar Imagem',
      error: {
        unableToRequest: 'Não foi possivel criar uma nova solicitação de imagem.',
        incorrectStatus: 'Status incorreto',
        typeRequired: 'Tipo é obrigatório.',
        statusRequired: 'Status é obrigatório.',
        patientRequired: 'Nome do paciente é obrigatório.',
      },
    },
    imaging: {
      label: 'Imagem',
      code: 'Código da imagem',
      status: 'Status',
      type: 'Tipos',
      notes: 'Notas',
      requestedOn: 'Solicitado em',
      completedOn: 'Finalizado em',
      canceledOn: 'Cancelado em',
      requestedBy: 'Solicitado por',
      patient: 'Paciente',
    },
  },
}
