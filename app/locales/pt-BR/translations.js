export default {

  dashboard: {
    title: 'O que você gostaria de fazer?'
  },
  errors: {
    inclusion: 'não está na lista',
    exclusion: 'é reservado',
    invalid: 'é inválido',
    confirmation: '{{attribute}} não corresponde',
    accepted: 'deve ser aceito',
    empty: 'não pode ser vazio',
    blank: 'não pode ser branco',
    present: 'pode ser branco',
    tooLong: 'é muito longo (quantidade máxima de caracteres é {{count}} )',
    tooShort: 'é muito curta (quantidade mínima de caracteres é {{count}})',
    wrongLength: 'o tamanho está errado (são esperados {{count}} caracteres)',
    notANumber: 'não é um número',
    notAnInteger: 'deve ser um número inteiro',
    greaterThan: 'deve ser maior do que {{count}}',
    greaterThanOrEqualTo: 'deve ser maior ou igual à {{count}}',
    equalTo: 'deve ser igual à {{count}}',
    lessThan: 'deve ser menor do que {{count}}',
    lessThanOrEqualTo: 'deve ser menor ou igual à {{count}}',
    otherThan: 'deve ser diferente de {{count}}',
    odd: 'deve ser ímpar',
    even: 'deve ser até',
    invalidNumber: 'número não é valido'
  },
  navigation: {
    imaging: 'Imagem',
    inventory: 'Inventário',
    patients: 'Pacientes',
    appointments: 'Compromisso',
    medication: 'Medicação',
    labs: 'Laboratórios',
    billing: 'Faturamento',
    administration: 'Administração',
    subnav: {
      actions: 'Ações',
      requests: 'Requisições',
      items: 'Itens',
      completed: 'Concluídos',
      newRequest: 'Nova Requisição',
      inventoryReceived: 'Inventário Recebido',
      reports: 'Relatórios',
      patientListing: 'Lista de Pacientes',
      newPatient: 'Novo Paciente',
      thisWeek: 'Essa Semana',
      today: 'Hoje',
      search: 'Pesquisa',
      addAppointment: 'Adicionar Compromisso',
      dispense: 'Dispensar',
      returnMedication: 'Retorno de Medicação',
      invoices: 'Faturas',
      newInvoice: 'Nova Fatura',
      prices: 'Preços',
      priceProfiles: 'Perfis de Preços',
      lookupLists: 'Listas de Pesquisa',
      addressFields: 'Campos de Endereço',
      loadDB: 'Carregar BD',
      users: 'Usuários',
      newUser: 'Novo Usuário',
      admittedPatients: 'Pacientes Admitidos',
      missed: 'Perdidos',
      userRoles: 'Perfis de Usuário',
      workflow: 'Workflow'
    },
    actions: {
      logout: 'Sair',
      login: 'Entrar'
    },
    about: 'Sobre HospitalRun'
  },
  user: {
    plusNewUser: '+ novo usuário',
    usersPageTile: 'Lista de Usuários'
  },
  admin: {
    addressOptions: 'Opções de Endereço',
    lookupLists: 'Lista de Pesquisas',
    loadDb: 'Carregar DB',
    userRoles: 'Perfis de Usuários',
    users: 'Usuários',
    address: {
      address1Label: 'Rótulo Endereço 1',
      address2Label: 'Rótulo Endereço 2',
      address3Label: 'Rótulo Endereço 3',
      address4Label: 'Rótulo Endereço 4',
      include1Label: 'Rótulo Include 1',
      include2Label: 'Rótulo Include 2',
      include3Label: 'Rótulo Include 3',
      include4Label: 'Rótulo Include 4',
      titles: {
        optionsSaved: 'Opções Salvas'
      },
      messages: {
        addressSaved: 'As opções de endereço foram salvas'
      },

      newTitle: 'Opções de Endereço',
      editTitle: 'Opções de Endereço',
      addressLabel: 'Endereço'
    },
    loaddb: {
      progressMessage: 'Por favor aguarde enquanto o seu banco de dados é carregado.',
      progressTitle: 'Carregando Banco de Dados',
      displayAlertTitle: 'Selecione o Arquivo para Carregar',
      displayAlertMessage: 'Por favor Selecione o Arquivo para Carregar.',
      errorDisplayAlertTitle: 'Erro ao carregar',
      errorDisplayAlertMessage: 'O banco de dados não foi carregado. O erro foi: {{error}}',
      editTitle: 'Carregando BD'
    },
    lookup: {
      deleteValueInventoryTypeMedicationTitle: 'Medicação Não Pode ser Excluída',
      deleteValueInventoryTypeMedicationMessage: 'O tipo de inventário Medicação não pode ser excluído por que é necessário para o Módulo de Medicação.',
      deleteValueLabPricingTypeProcedureTitle: 'Tipo de Preço Laboratório Não Pode Ser Excluído',
      deleteValueLabPricingTypeProcedureMessage: 'O tipo de preço Procedimento Laboratorial não pode ser excluído por que é necessário para o Módulo de Laboratório.',
      deleteValueImagingPricingTypeProcedureTitle: 'Tipo de Preço Imagem Não Pode Ser Excluído',
      deleteValueImagingPricingTypeProcedureMessage: 'O tipo de preço Imagem não pode ser excluído por que é necessário para o Módulo de Imagem.',
      deleteValueVisitTypeAdmissionTitle: 'Tipo de Visita Admissão Não Pode Ser Excluído',
      deleteValueVisitTypeAdmissionMessage: 'O Tipo de Visita Admissão não pode ser excluído por que é necessário para o Módulo de Visitas.',
      deleteValueVisitTypeImagingTitle: 'Tipo de Visita Imagem Não Pode Ser Excluído',
      deleteValueVisitTypeImagingMessage: 'O Tipo de Visita Imagem não pode ser excluído por que é necessário para o Módulo de Imagem.',
      deleteValueVisitTypeLabTitle: 'Tipo de Visita Laboratório Não Pode Ser Excluído',
      deleteValueVisitTypeLabMessage: 'O Tipo de Visita Laboratório  não pode ser excluído por que é necessário para o Módulo de Laboratório',
      deleteValueVisitTypePharmacyTitle: 'Tipo de Visita Farmácia Não Pode Ser Excluído',
      deleteValueVisitTypePharmacyMessage: 'Tipo de Visita Farmácia não pode ser excluído por que é necessário para o Módulo de Medicação.',
      alertImportListTitle: 'Selecione o arquivo para importação',
      alertImportListMessage: 'Por favor Selecione o arquivo para importação.',
      alertImportListSaveTitle: 'Lista Importdada',
      alertImportListSaveMessage: 'A lista de pesquisa foi importada.',
      alertImportListUpdateTitle: 'Lista Salva',
      alertImportListUpdateMessage: 'A lista de pesquisa foi salva.',
      pageTitle: 'Listas de Pesquisa',
      edit: {
        template: {
          addTitle: 'Adicionar Valor',
          editTitle: 'Editar Valor',
          updateButtonTextAdd: 'Adicionar',
          updateButtonTextUpdate: 'Atualizar',
          labelTitle: 'Valor'
        }
      },
      anesthesiaTypes: 'Tipos de Anestesia',
      anesthesiologists: 'Anestesiologista',
      billingCategories: 'Categorias de Faturamento',
      clinicList: 'Localização de Clínicas',
      countryList: 'Países',
      diagnosisList: 'Diagnósticos',
      cptCodeList: 'Códigos CPT',
      expenseAccountList: 'Contas de Despesas',
      aisleLocationList: 'Localização de Corredores no Inventário',
      warehouseList: 'Locais de Inventário',
      inventoryTypes: 'Tipos de Inventário',
      imagingPricingTypes: 'Tipos de Preço Imagem',
      labPricingTypes: 'Tipos de Preço Laboratório',
      patientStatusList: 'Lista de Situação do Paciente',
      physicianList: 'Médicos',
      procedureList: 'Procedimentos',
      procedureLocations: 'Localização de Procedimentos',
      procedurePricingTypes: 'Tipos de Preço Procedimento',
      radiologists: 'Radiologista',
      unitTypes: 'Tipos de Unidade',
      vendorList: 'Fornecedor',
      visitLocationList: 'Localização dos Visitantes',
      visitTypes: 'Tipos de Visita',
      wardPricingTypes: 'Tipos de Preços Enfermaria'
    },
    roles: {
      capability: {
        admin: 'Administração',
        loadDb: 'Carregar Banco de Dados',
        updateConfig: 'Atualizar Configurações',
        appointments: 'Compromissos',
        addAppointment: 'Adicionar Compromissos',
        billing: 'Faturamentos',
        addCharge: 'Adicionar Cobrança',
        addPricing: 'Adicionar Preço',
        addPricingProfile: 'Adicionar Perfil de Preço',
        addInvoice: 'Adicionar Fatura',
        addPayment: 'Adicionar Pagamentos',
        deleteInvoice: 'Excluir Fatura',
        deletePricing: 'Excluir Preço',
        deletePricingProfile: 'Excluir Perfil de Preço',
        editInvoice: 'Editar Fatura',
        invoices: 'Faturas',
        overrideInvoice: 'Substituir Fatura',
        pricing: 'Preço',
        patients: 'Pacientes',
        addDiagnosis: 'Adicionar Diagnóstico',
        addPhoto: 'Adicionar Foto',
        addPatient: 'Adicionar Paciente',
        addProcedure: 'Adicionar Procedimento',
        addVisit: 'Adicionar Visita',
        addVitals: 'Adicionar Sinais Vitais',
        admitPatient: 'Admitir Paciente',
        deletePhoto: 'Excluir Paciente',
        deletePatient: 'Excluir Paciente',
        deleteAppointment: 'Excluir Compromisso',
        deleteDiagnosis: 'Excluir Diagnóstico',
        deleteProcedure: 'Excluir Procedimento',
        deleteSocialwork: 'Excluir Trabalho Social',
        deleteVitals: 'Excluir Sinais Vitais',
        deleteVisit: 'Excluir Visita',
        dischargePatient: 'Alta do Paciente',
        patientReports: 'Relatório do Paciente',
        visits: 'Visita',
        medication: 'Medicação',
        addMedication: 'Adicionar Medicação',
        deleteMedication: 'Excluir Medicação',
        fulfillMedication: 'Preencher Medicação',
        labs: 'Laboratório',
        addLab: 'Adicionar Laboratório',
        completeLab: 'Laboratório Concluído',
        deleteLab: 'Excluir Laboratório',
        imaging: 'Imagem',
        addImaging: 'Adicionar Imagem',
        completeImaging: 'Imagem Concluída',
        deleteImaging: 'Excluir Imagem',
        inventory: 'Inventário',
        addInventoryRequest: 'Adicionar Requisição de Inventário',
        addInventoryItem: 'Adicionar Item de Inventário',
        addInventoryPurchase: 'Adicionar Compra de Inventário',
        adjustInventoryLocation: 'Ajustar Localização de Inventário',
        deleteInventoryItem: 'Excluir Item de Inventário',
        fulfillInventory: 'Preencher Inventário',
        userRoles: 'Perfis de Usuários'
      },
      messages: {
        roleSaved: 'O perfil {{roleName}} foi salvo.'
      },
      titles: {
        roleSaved: 'Perfil Salvo'
      }
    },
    workflow: {
      admissionDepositLabel: 'Depósito de Admissão é exigido',
      clinicPrepaymentLabel: 'Pagamento Antecipado da Clínica é exigido',
      followupPrepaymentLabel: 'Pagamento Antecipado do Acompanhamento é exigido',
      outpatientLabLabel: 'Pagamento Antecipado do Laboratório Ambulatorial é exigido',
      outpatientImagingLabel: 'Pagamento Antecipado do Ambulatorio de Imagem é exigido',
      outpatientMedicationLabel: 'Pagamento Antecipado do Ambulatorio de Medicação é exigido',

      titles: {
        optionsSaved: 'Opções Salvas'
      },
      messages: {
        optionsSaved: 'As opções de WorkFlow foram salvas'
      },

      newTitle: 'Opções de Workflow',
      editTitle: 'Opções de Workflow',
      workflowLabel: 'Workflow'

    }
  },
  labels: {
    cptcode: 'Código CPT*',
    loading: 'Carregando',
    name: 'Nome',
    note: 'Note',
    patient: 'Paciente',
    prescriber: 'Médico Responsável pela Prescrição',
    quantity: 'Quantidade',
    requestedOn: 'Solicitado em',
    date: 'Data',
    dateOfBirth: 'Data de Nascimento',
    dateOfBirthShort: 'DtNasc',
    dateRequested: 'Data da Requisição',
    dateCompleted: 'Data da Conclusão',
    description: 'Descrição',
    requestedBy: 'Requisitado por',
    fulfill: 'Preencha',
    fulfillRequest: 'Preencha a Requisição',
    fulfillRequestNow: 'Preencha a Requisição Agora',
    actions: 'Ações',
    action: 'Ação',
    notes: 'Notas',
    edit: 'Editar',
    imageOrders: 'Pedido de Imagem',
    labOrders: 'Pedidos de Laboratório',
    patientHistory: 'Histórico do Paciente',
    imagingType: 'Tipo de Imagem',
    result: 'Resultado',
    results: 'Resultados',
    visit: 'Visita',
    requests: 'Requisições',
    completed: 'Completo',
    id: 'Id',
    on: 'ligado',
    type: 'Tipo',
    sex: 'Sexo',
    age: 'Idade',
    search: 'Pesquisa',
    username: 'Usuário',
    email: 'Email',
    role: 'Papel',
    delete: 'Excluir',
    userCanAddNewValue: 'O usuário pode adicionar novos valores',
    value: 'Valor',
    lookupType: 'Tipo de Pesquisa',
    importFile: 'Importar Arquivo',
    fileLoadSuccessful: 'Arquivo Carregado com Sucesso',
    fileToLoad: 'Carregar Arquivo',
    startTime: 'Hora Início',
    startDate: 'Data de Início',
    endTime: 'Hora de Término',
    endDate: 'Data de Término',
    docRead: 'Documentos Lidos',
    docWritten: 'Documentos Escritos',
    displayName: 'Nome de Exibição',
    password: 'Senha',
    editUser: 'Editar Usuário',
    newUser: 'Novo Usuário',
    deleteUser: 'Excluir Usuário',
    medication: 'Medicação',
    status: 'Situação',
    addNewOutpatientVisit: '--Adicionar Nova Visita Ambulatorial--',
    prescription: 'Prescrição',
    prescriptionDate: 'Data da Prescrição',
    billTo: 'Conta Para',
    pullFrom: 'Puxar De',
    fulfilled: 'Preenchido',
    deleteRequest: 'Excluir Requisição',
    location: 'Localização',
    provider: 'Fornecedor',
    with: 'Com',
    allDay: 'Todo Dia',
    physician: 'Médico',
    assisting: 'Ajudante',
    anesthesia: 'Anestesia',
    procedures: 'Procedimentos',
    number: 'Número',
    billDate: 'Data da Conta',
    balanceDue: 'Saldo Devedor',
    amount: 'Quantidade',
    datePaid: 'Data de Pagamento',
    creditTo: 'Crédito Para',
    invoiceId: 'ID da Fatura',
    lineItems: 'Itens de Linha',
    discount: 'Desconto',
    excess: 'Excesso',
    price: 'Preço',
    total: 'Total',
    expenseTo: 'Despesa Para',
    grandTotal: 'Total Geral',
    remarks: 'Observações',
    payments: 'Pagamentos',
    category: 'Categoria',
    department: 'Departamento',
    address: 'Endereço',
    country: 'País'
  },
  messages: {
    noItemsFound: 'Nenhum item encontrado',
    noHistoryAvailable: 'Histórico não disponível.',
    createNewRecord: 'Criar uma nova gravação?',
    createNewUser: 'Criar um novo usuário?',
    noUsersFound: 'Nenhum usuário encontrado.',
    areYouSureDelete: 'Você tem certeza que deseja excluir o usuário {{user}}?',
    userHasBeenSaved: 'O usuário foi salvo.',
    userSaved: 'Usuário Salvo',
    onBehalfOf: 'em nome de',
    newPatientHasToBeCreated: 'Um novo paciente precisa ser criado... Por favor aguarde...',
    noNotesAvailable: 'Nenhuma nota clinica adicional está diponível para essa visita.',
    sorry: 'Desculpe, algo deu errado...',
    forAuthorizedPersons: 'Este relatório é somente para pessoas autorizadas.'
  },
  alerts: {
    pleaseWait: 'Por Favor Aguarde'
  },
  headings: {
    chargedItems: 'Itens Carregados'
  },
  buttons: {
    addItem: 'Adicionar Item',
    complete: 'Completo',
    cancel: 'Cancelar',
    close: 'Fechar',
    returnButton: 'Retornar',
    barcode: 'Código de Barras',
    add: 'Adicionar',
    update: 'Atualizar',
    ok: 'Ok',
    fulfill: 'Preencher',
    remove: 'Remover',
    delete: 'Excluir',
    newUser: 'Novo Usuário',
    addValue: 'Adicionar Valor',
    newNote: 'Nova Nota',
    import: 'Importar',
    loadFile: 'Carregar Arquivo',
    newRequest: 'Nova Requisição',
    allRequests: 'Todas as Requisições',
    dispense: 'Dispensar',
    newItem: '+ novo item',
    newRequestPlus: '+ nova requisição',
    addVisit: 'Adicionar Visita',
    search: 'Pesquisa',
    edit: 'Editar',
    addLineItem: 'Adicionar Item de Linha'
  },
  login: {
    messages: {
      signIn: 'inscreva-se',
      error: 'Nome de usuário ou senha está incorreta.'
    },
    labels: {
      password: 'Senha',
      username: 'Usuário',
      signIn: 'Entrar'
    }
  },
  loading: {
    progressBar: {
      progress: '{{progressBarValue}}% concluído'
    },
    messages: {
      0: 'A velocidade de vôo borboleta superior é de 12 milhas por hora. Alguns meses pode voar 25 milhas por hora!',
      1: 'As corujas são os únicos pássaros que podem ver a cor azul.',
      2: 'Os gatos têm mais de 100 sons vocais; cachorros têm apenas 10.',
      3: 'Os Humanos usam um total de 72 músculos diferentes na fala.',
      4: 'Mais de 1.000 idiomas diferentes são falados no continente africano',
      5: 'Uma eritrofobo é alguém que fica vermelho facilmente.',
      6: 'A fobia mais comum do mundo é a Odinofobia que é o medo da dor.',
      7: 'Seu corpo utiliza 300 músculo para manter o equilíbrio quando você está parado.',
      8: 'Alguns sapos podem ser congelados e depois de serem descongelados continuarem a viver.',
      9: 'Nossos olhos estão sempre do mesmo tamanho de quando nascemos, mas nossas orelhas e nariz nunca param de crescer.',
      10: 'Sua língua é o único músculo em seu corpo qu está ligado apenas em uma extremidade.',
      11: 'Camelos tem três pálpebras para se protegerem das tempestades de areia.'
    }
  },
  inventory: {
    edit: {
      cost: 'Preço por Unidade:',
      delivered: 'Entregue a:',
      location: 'Localização Ajustada:',
      prescription: 'Prescrição para:',
      pulled: 'Retirado de:',
      quantity: 'Quantidade na Conclusão:',
      reason: 'Motivo:',
      returned: 'Devolvido do Paciente:',
      transferredFrom: 'Transferido de:',
      transferredTo: 'Transferido para:'
    },
    labels: {
      action: 'Ação',
      add: 'Adicionar',
      adjust: 'Ajustar',
      adjustmentDate: 'Data de Ajuste',
      adjustmentFor: 'Ajuste Para',
      adjustmentType: 'Tipo de Ajuste',
      aisle: 'Corredor',
      aisleLocation: 'Localização do Corredor',
      allInventory: 'Todo Inventário',
      billTo: 'Conta Para',
      consumePurchases: 'Compras para Consumo',
      consumptionRate: 'Taxa de Consumo',
      cost: 'Preço',
      costPerUnit: 'Preço por Unidade',
      crossReference: 'Referência Cruzada',
      currentQuantity: 'Quantidade Atual',
      dateCompleted: 'Data de Conclusao',
      dateEffective: 'Data Efetiva',
      dateEnd: 'Data de Término',
      dateStart: 'Data de Início',
      dateReceived: 'Data Recebida',
      dateTransferred: 'Data Transferida',
      daysLeft: 'Dias Restantes',
      deliveryAisle: 'Corredor de Entrega',
      deliveryLocation: 'Local de Entrega',
      distributionUnit: 'Centro de Distribuição',
      deleteItem: 'Deletar Item',
      details: 'Detalhes',
      editItem: 'Editar Item',
      expense: 'Despesa para',
      expirationDate: 'Data de Expiração',
      fulfillRequest: 'Preencher Requisição',
      fulfillRequestNow: 'Preencher Requisição Agora',
      gift: 'Doação em Espécie',
      giftUsage: 'Uso de Doação em Espécie',
      giftInKindNo: 'N',
      giftInKindYes: 'S',
      inventoryConsumed: 'Inventário Consumido',
      inventoryItem: 'Item de Inventário',
      inventoryObsolence: 'Obsolescência de Inventário',
      invoiceItems: 'Itens da Fatura',
      invoiceLineItem: 'Item de Linha da Fatura',
      invoiceNumber: 'Número da Fatura',
      item: 'Item',
      items: 'Itens',
      itemNumber: 'Número de Item',
      location: 'Localização',
      locations: 'Localizações',
      name: 'Nome',
      markAsConsumed: 'Marcar como Consumido',
      newItem: 'Novo Item',
      allItems: 'Todos os Itens',
      originalQuantity: 'Quantidade Original',
      print: 'Imprimir',
      printBarcode: 'Imprimir Código Barras',
      printer: 'Impressora',
      pullFrom: 'Retirar de',
      purchases: 'Compras',
      purchaseCost: 'Custo da Compra',
      purchaseInfo: 'Informações da Compra',
      quantity: 'Quantity ({{unit}})',
      quantityAvailable: 'Quantity Available',
      quantityOnHand: 'Quantidade on Hand',
      quantityRequested: 'Quantidade Solicitada',
      rank: 'Classificação',
      reason: 'Motivo',
      remove: 'Remover',
      reorderPoint: 'Ponto de Reabastecimento',
      requestedItems: 'Itens Solicitados',
      salePricePerUnit: 'Preço de Venda por Unidade',
      save: 'Salvar',
      serialNumber: 'Lote/Número de Série',
      total: 'Total',
      totalCost: 'Preço Total',
      totalReceived: 'Total Recebido: {{total}}',
      transaction: 'Transação',
      transactions: 'Transações',
      transfer: 'Transferir',
      transferFrom: 'Transferir de',
      transferTo: 'Transferir para Localização',
      transferToAisle: 'Transferir para Localização de Corredor',
      unit: 'Unidade',
      unitCost: 'Preço Unitário',
      vendor: 'Fornecedor',
      vendorItemNumber: 'Número de Item do Fornecedor',
      xref: 'RefX'
    },
    messages: {
      adjust: 'Por favor ajustar as quantidades no(s) local(is) apropriado(s) da conta para a diferença de {{difference}}.',
      createRequest: 'Criar uma nova requisição?',
      delete: 'Você tem certeza que deseja excluir {{name}}?',
      itemNotFound: 'O item de inventário <strong>{{item}}</strong> não pode ser encontrado.<br>Se você quiser criar um novo item de inventário, preencha as informações abaixo.<br>Caso o contrário, pressione o botão Cancelar para voltar.',
      loading: 'Carregando transações ...',
      purchaseSaved: 'As compras de inventário foram salvas com sucesso.',
      noRequests: 'Nenhuma requisição encontrada.',
      noItems: 'Nenhum item encontrado.',
      quantity: 'A quantidade total de <strong>({{quantity}})</strong> não corresponde com a quantidade total nas localizações<strong>({{locationQuantity}})</strong>.',
      removeItem: 'Você tem certeza de que deseja remover este item desta fatura?',
      removeItemRequest: 'Você tem certeza de que deseja remover este item desta requisição?',
      requestFulfilled: 'A requisição de invenário foi preenchida.',
      requestUpdated: 'A requisição de invenário foi atualizada.',
      warning: 'Por favor preencher campos obrigatório (marcado(s) com *) e corrija os erros antes de adicionar.'
    },
    reports: {
      rows: {
        adjustments: 'Ajustes',
        adjustmentsTotal: 'Total dos Ajustes',
        balanceBegin: 'Balanço Inicial',
        balanceEnd: 'Balanço Final',
        category: 'Categoria',
        consumed: 'Consumidos',
        consumedGik: 'Doações Consumidas',
        consumedGikTotal: 'Total Doações Consumidas',
        consumedPuchases: 'Compras Consumidas',
        consumedPurchasesTotal: 'Total Compras Consumidas',
        consumedTotal: 'Total Consumido',
        errInFinSum: 'Erro em _generateFinancialSummaryReport: ',
        errInFindPur: 'Erro em _findInventoryItemsByPurchase: ',
        errInFindReq: 'Erro em _findInventoryItemsByRequest: ',
        expensesFor: 'Despesas para: ',
        noAccount: '(Sem Conta)',
        subtotal: 'Subtotal: ',
        subtotalFor: 'Subtotal para {{category}} - {{account}}: ',
        total: 'Total: ',
        totalFor: 'Total para {{var}}: ',
        totalPurchases: 'Total de Compras',
        transfer1: '{{quantity}} de {{location}}',
        trasnfer2: 'De: {{source}} Para: {{target}}'
      },
      adjustment: 'Ajuste Detalhado',
      daysSupply: 'Dias de Abastecimento Deixado no Estoque',
      expenseDetail: 'Despesas Detalhadas',
      expenseSum: 'Sumário de Despesas',
      expiration: 'Data de Expiração',
      export: 'Exportar Relatório',
      fields: 'Campos para Incluir',
      finance: 'Sumário Financeiro',
      generate: 'Gerar Relatório',
      invLocation: 'Inventário por Localização',
      invValuation: 'Valorização do Inventário',
      purchaseDetail: 'Compras Detalhadas',
      purchaseSum: 'Sumário de Compras',
      reportType: 'Tipo de Relatório',
      stockTransferDetail: 'Tranferências de Estoque Detalhadas',
      stockTransferSum: 'Sumário de Tranferências de Estoque',
      stockUsageDetail: 'Uso de Estoque Detalhado',
      stockUsageSum: 'Sumário de Uso de Estoque'
    },
    titles: {
      addPurchase: 'Adicionar Compra',
      addRequest: 'Nova Requisição',
      adjustment: 'Ajuste',
      editPurchase: 'Editar Compra',
      editRequest: 'Editar Requisição',
      inventoryItem: 'Novo Item de Inventário',
      inventoryReport: 'Relatório de Inventário',
      purchaseSaved: 'Compras de Invenários Salvas',
      quickAddTitle: 'Novo Item de Inventário',
      removeItem: 'Remover Item',
      requestFulfilled: 'Requisição Preenchida',
      requestUpdated: 'Requisição Atualizada',
      transfer: 'Itens de Transferência',
      warning: 'Atenção!!!!!'
    }
  },
  imaging: {
    pageTitle: 'Requisição de imagens',
    sectionTitle: 'Imagem',
    buttons: {
      newButton: '+ nova imagem'
    },
    labels: {
      radiologist: 'Radiologista',
      addNewVisit: '--Adicionar novo visitante--'
    },
    messages: {
      delete: 'Você tem certeza que deseja excluir essa requisição de imagem?',
      noCompleted: 'Nenhum item completo encontrado.'
    },
    titles: {
      completedImaging: 'Imagem completa',
      editTitle: 'Requisição de edição de imagem',
      newTitle: 'Nova requisição de imagem'
    },
    alerts: {
      completedTitle: 'Requisição de Imagem Completa',
      completedMessage: 'A requisição de imagem esta completa.',
      savedTitle: 'Requisição de imagem salva',
      savedMessage: 'A requisição de imagem foi salva.'
    }
  },
  medication: {
    pageTitle: 'Requisição de Medicação',
    sectionTitle: 'Medicação',
    returnMedication: 'Retorno de Medicação',
    buttons: {
      dispenseMedication: 'dispensar medicação',
      newButton: '+ nova requisição',
      returnMedication: 'retorno de medicação'
    },
    titles: {
      completedMedication: 'Medicação Concluída',
      editMedicationRequest: 'Editar Requisição de Medicação',
      newMedicationRequest: 'Nova Requisição de Medicação'
    },
    messages: {
      createNew: 'Criar uma nova requisição de medicação?',
      confirmDeletion: 'Você tem certeza que deseja excluir essa requisição de medicação?'
    },
    labels: {
      refills: 'Recargas',
      quantityRequested: 'Quantidade Requisitada',
      quantityDispensed: 'Quantidade Dispensada',
      quantityDistributed: 'Quantidade Distribuída',
      quantityToReturn: 'Quantidade Retornada',
      returnLocation: 'Localização de Retorno',
      returnAisle: 'Corredor de Retorno',
      returnReason: 'Razão/Notas de Retorno',
      adjustmentDate: 'Data de Ajuste',
      creditToAccount: 'Crédito na Conta'
    },
    alerts: {
      returnedTitle: 'Medicação Retornada',
      returnedMessage: 'A medicação foi marcada como retornada.',
      savedTitle: 'Requisição de Medicação foi Salva',
      savedMessage: 'O registro de medicação foi salvo.',
      fulfilledTitle: 'Requisição de Medicação Preenchido'
    }
  },
  appointments: {
    currentScreenTitle: 'Lista de Compromisso',
    editTitle: 'Editar Compromisso',
    newTitle: 'Novo Compromisso',
    sectionTitle: 'Compromissos',
    thisWeek: 'Compromissos dessa Semana',
    missed: 'Compromissos Esquecidos',
    searchTitle: 'Pesquisar Compromissos',
    todayTitle: 'Compromissos de Hoje',
    messages: {
      deleteAppointmentMessage: 'Você tem certeza que deseja excluir esse compromisso?',
      endTimeLaterThanStart: 'Por favor, selecione um horário de término mais tarde do que a hora de início.'
    },
    buttons: {
      newButton: '+ novo compromisso'
    },
    labels: {
      selectedStartingDate: 'Mostrar Compromisso em ou após'
    }
  },
  vitals: {
    messages: {
      delete: 'Você tem certeza que deseja excluir esses sinais vitais?'
    },
    labels: {
      dateRecorded: 'Data de Gravação',
      temperature: 'Temperatura',
      weight: 'Peso',
      height: 'Altura',
      sbp: 'PAS',
      dbp: 'PAD',
      heartRate: 'Frequência Cardíaca',
      respiratoryRate: 'Frequência Respiratória'
    }
  },
  visits: {
    titles: {
      additionalDiagnoses: 'Diagnósticos Adicionais'
    },
    messages: {
      delete: 'Você tem certeza que deseja excluir essa visita?'
    },
    buttons: {
      newProcedure: 'Novo Procedimento',
      newLab: 'Novo Laboratório',
      newAppointment: 'Novo Compromisso',
      addDiagnosis: 'Adicionar Diagnóstico',
      newImaging: 'Nova Imagem',
      newMedication: 'Nova Medicação',
      newVitals: 'Novos Sinais Vitais'
    },
    labels: {
      diagnosis: 'Diagnósticos',
      procedure: 'Procedimentos',
      authoredBy: 'Autorizado Por',
      labs: 'Laboratório',
      imaging: 'Imagem',
      visitInformation: 'Imformação de Visita',
      examiner: 'Examinador',
      medication: 'Medicação',
      status: 'Situação de Visita',
      admittingDiagnosis: 'Diagnósticos de Admisão',
      finalDiagnosis: 'Diagnósticos de Finais/Faturamento',
      visitType: 'Tipo de Visita',
      vitals: 'Sinais Vitais'
    }
  },
  labs: {
    sectionTitle: 'Laboratório',
    requestsTitle: 'Requisições de Laboratório',
    editTitle: 'Editar Requisição de Laboratório',
    newTitle: 'Nova Requisição de Laboratório',
    deleteTitle: 'Excluir Requisição',
    completedTitle: 'Laboratórios Concluídos',
    labels: {
      labType: 'Tipo de Laboratório',
      addNewVisit: '--Adicionar Nova Visita--'
    },
    messages: {
      noItemsFound: 'Nenhum laboratório encontrado.',
      createNewRecord: 'Criar novo registro?',
      confirmDeletion: 'VOcê tem certeza que deseja excluir essa requisição de laboratório?',
      noCompleted: 'Items concluídos não econtrados.'
    },
    buttons: {
      newButton: '+ novo laboratório'
    },
    alerts: {
      requestCompletedTitle: 'Requisições de Laboratório Concluída',
      requestCompletedMessage: 'Requisição de laboratório foi concluída.',
      requestSavedTitle: 'Requisição de Laboratório Salva',
      requestSavedMessage: 'A requisição de laboratório foi salva.'
    }
  },
  patients: {
    navigation: {
      photos: 'Fotos',
      general: 'Geral',
      history: 'Histórico',
      appointments: 'Compromissos',
      visits: 'Visitas',
      medication: 'Medicação',
      imaging: 'Imagem',
      labs: 'Laboratórios',
      socialWork: 'Assitência Social'
    },
    titles: {
      expenses: 'Despesas',
      additionalContacts: 'Contatos Adicionais',
      familyInformation: 'Informação Familiar',
      delete: 'Excluir Paciente',
      new: 'Novo Paciente',
      edit: 'Editar Paciente',
      patient: 'Relatório de Paciente',
      patientListing: 'Lista de Pacientes',
      addPhoto: 'Adicionar Foto',
      editPhoto: 'Editar Foto',
      socialWork: 'Despesa',
      familyInfo: 'Informação Familiar',
      deleteFamilyMember: 'Excluir Membro Familiar',
      deleteExpense: 'Excluir Despesa',
      deletePhoto: 'Excluir Foto',
      deleteContact: 'Excluir Contato',
      savedPatient: 'Paciente Salvo'
    },
    messages: {
      areYouSureDelete: 'Você tem certeza que deseja excluir este(a) {{object}}?',
      deletePatient: 'Você tem certeza que deseja excluir {{firstName}} {{lastName}}?',
      noPatientsFound: 'Nenhum paciente encontrado.',
      savedPatient: 'O registro de paciente para {{displayName}} foi salvo.',
      notFoundQuickAdd: 'O paciente <strong>{{patientFullName}}</strong> não pode ser encontrato.  Se você deseja cadastras um novo paciente, preencha as informações abaixo.  Caso contrário clique em Cancelar para voltar.',
      createNewPatient: 'Criar novos registro de paciente?'
    },
    buttons: {
      addExpense: 'Adicionar Despesa',
      addContact: 'Adicionar Contato',
      newLab: 'Novo Laboratório',
      newVisit: 'Nova Visita',
      newMedication: 'Nova Medicação',
      newImaging: 'Nova Imagem',
      addFamilyMember: 'Adicionar Membro Familiar',
      newPhoto: 'Nova Foto',
      newAppointment: 'Novo Compromisso',
      backToPatients: 'Voltar para Lista de Pacientes',
      newPatient: '+ novo paciente'
    },
    headings: {
      history: 'Histórico',
      historySince: 'Histórico Desde'
    },
    labels: {
      primaryDiagnosis: 'Diagnósticos Primários',
      secondaryDiagnosis: 'Diagnósticos Secundários',
      monthlyCost: 'Custo Mensal',
      totalMontlyExpense: 'Total de Despesas Mensais',
      patientType: 'Tipo de Paciente',
      admissionDate: 'Data de Admissão',
      patientDays: 'Dias do Paciente',
      dischargeDate: 'Data de Pagamento',
      discharge: 'Pagamento',
      admit: 'Admitir',
      relationships: 'Relação',
      phone: 'Telefone',
      email: 'Email',
      firstName: 'Primeiro Nome',
      middleName: 'Nome do meio',
      lastName: 'Último Nome',
      sex: 'Sexo',
      dob: 'DatNasc',
      dateOfBirth: 'Data de Nascimento',
      placeOfBirth: 'Local de Nascimento',
      sources: 'Fontes',
      costs: 'Custos',
      civilStatus: 'Estado Civil',
      relationship: 'Relação com Paciente',
      education: 'Educação',
      occupation: 'Ocupação',
      income: 'Renda',
      insurance: 'Seguro',
      dateProcessed: 'Data de Processamento',
      status: 'Situação do Paciente',
      externalPatientId: 'ID de Paciente Externo',
      bloodType: 'Tipo Sanguíneo',
      clinic: 'Site(Filial) da Clínica',
      referredBy: 'Indicado Por',
      referredDate: 'Data de Indicação',
      religion: 'Religião',
      parent: 'Responsável Legal'
    },
    notes: {
      newNote: 'Nova Nota para',
      updateNote: 'Atualizando Nota de',
      onBehalfOfLabel: 'Em Nome de',
      onBehalfOfCopy: 'em nome de',
      pleaseSelectAVisit: 'Por favor selecione uma visita'
    }
  },
  billing: {
    alerts: {
      noInvoiceFound: 'Nenhuma fatura encontrada',
      deleteItem: 'Você tem certeza que deseja excluir {{item}}?',
      noPricingItems: 'Nenhum item de preço encontrado.',
      noPricingProfiles: 'Nenhum perfil de preço encontrado.'
    },
    buttons: {
      createInvoice: 'Criar nova fatura?',
      addOverride: 'Adicionar Substituir'
    },
    labels: {
      externalInvoiceNumber: 'Fatura Externa #',
      paymentProfile: 'Perfil de Pagamento',
      actualCharges: 'Cobranças Atuais',
      insurance: 'Seguro Nacional',
      hmoCom: 'HMO/COM',
      paymentsDeposits: 'Pagamentos/Depositos',
      pricingPanelOverrides: 'Substituição e Perfil de Preços',
      pricingProfile: 'Perfil de Preços',
      discountAmount: 'Quantidade de Desconto',
      discountPercentage: 'Porcentagem de Desconto'
    }
  },
  print: {
    invoice: {
      labels: {
        patientName: 'NOME DO PACIENTE:',
        patientId: 'PACIENTE #:',
        patientAge: 'IDADE:',
        patientAddress: 'ENDEREÇO:',
        dateAdmitted: 'ADMITIDO:',
        dateDischarged: 'PAGAMENTO:',
        dischargeNotes: 'Notas de Pagamento:',
        remarks: 'Observações:',
        billedBy: 'Faturado por:',
        billedDate: 'Data de Faturamento:',
        spacer: '__________________________________________'
      },
      messages: {
        whereConducted: 'foram deduzidos durante minha internação'
      },
      titles: {
        patientMember: 'Paciente-Membro',
        relContact: 'Relações/Contato',
        patients: 'DO PACIENTE',
        billingStatement: 'DECLARAÇÃO DO FATURAMENTO'
      }
    }
  },
  procedures: {
    titles: {
      addChargeItem: 'Adicionar Item de Cobrança',
      deleteChargeItem: 'Excluir Item de Cobrança',
      editChargeItem: 'Editar Item de Cobrança',
      medicationUsed: 'Medicação Usada',
      deleteMedicationUsed: 'Excluir Medicação Usada',
      addMedicationUsed: 'Adicionar Medicação Usada',
      editMedicationUsed: 'Editar Medicação Usada',
      edit: 'Editar Procedimento',
      saved: 'Procedimento Salvo',
      new: 'Novo Procedimento'
    },
    labels: {
      medicationUsed: 'Medicação Usada'
    },
    messages: {
      deleteMedication: 'Você tem certeza que deseja excluir esta medicação?',
      delete: 'Você tem certeza que deseja excluir este procedimento?',
      saved: 'O registro de procedimento foi salvo.'
    },
    buttons: {
      addMedication: 'Adicionar Medicação'
    }
  },
  components: {
    chargesByTypeTab: {
      charges: 'cobranças'
    },
    takePhoto: {
      how: 'Como você quer adicionar um Foto?',
      takePhoto: 'Tirar um Foto',
      uploadPhoto: 'Upload de Foto',
      uploadFile: 'Upload de Arquivo',
      camera: 'Câmera',
      photo: 'foto',
      preview: 'pré visualização'
    },
    quantityConv: {
      unit: 'Unidade',
      conversion: 'O que significa contém 1 {{name}}?'
    },
    quantityCalc: {
      result: '{{targetUnit}} total: {{calculated}}'
    },
    priceList: {
      charges: 'cobranças de {{pricingType}}'
    }
  }
};
