export default {
  dashboard: {
    title: '¿Qué deseas hacer?'
  },
  errors: {
    inclusion: 'no está incluido en la lista',
    exclusion: 'es reservado',
    invalid: 'es invalido',
    confirmation: '{{attribute}} no corresponde',
    accepted: 'debe ser aceptado',
    empty: 'no puede ser vacío',
    blank: 'no puede ser en blanco',
    present: 'puede ser blanco',
    tooLong: 'demasiado largo (máximo {{count}} caracteres)',
    tooShort: 'demasiado corto (mínimo {{count}} caracteres)',
    wrongLength: 'el tamaño es incorrecto (deben ser {{count}} caracteres)',
    notANumber: 'no es un número',
    notAnInteger: 'debe ser un número entero',
    greaterThan: 'debe ser mayor que {{count}}',
    greaterThanOrEqualTo: 'debe ser mayor o igual a {{count}}',
    equalTo: 'debe ser igual a {{count}}',
    lessThan: 'debe ser menor que {{count}}',
    lessThanOrEqualTo: 'debe ser menor o igual a {{count}}',
    otherThan: 'debe ser diferente a {{count}}',
    odd: 'debe ser impar',
    even: 'debe ser par',
    invalidNumber: 'número no válido',
    result: 'Por favor introduce un resultado antes de completar'
  },
  dates: {
    long: '{{years}} años {{months}} meses {{days}} días',
    longPlural: '{{years}} años {{months}} meses {{days}} días',
    longOmitYears: '{{months}} meses {{days}} días',
    longOmitDays: '{{years}} año {{months}} meses',
    longOmitDaysPlural: '{{years}} años {{months}} meses',
    longOmitDaysYears: '{{months}} meses',
    shortOmitYears: '{{months}}m {{days}}d',
    short: '{{years}}y {{months}}m {{days}}d'
  },
  navigation: {
    imaging: 'Radiografía',
    inventory: 'Inventario',
    patients: 'Pacientes',
    appointments: 'Citas',
    medication: 'Recetas Médicas',
    labs: 'Laboratorio',
    billing: 'Facturas',
    administration: 'Administración',
    subnav: {
      actions: 'Acciones',
      requests: 'Pedidos',
      items: 'Artículos',
      completed: 'Completado',
      newRequest: 'Nuevo Pedido',
      inventoryReceived: 'Inventario Recibido',
      reports: 'Reportes',
      patientListing: 'Lista de Pacientes',
      newPatient: 'Nuevo Paciente',
      thisWeek: 'Esta Semana',
      today: 'Hoy',
      search: 'Buscar',
      addAppointment: 'Nueva Cita',
      dispense: 'Despachar',
      returnMedication: 'Devolver Medicamento',
      invoices: 'Facturas',
      newInvoice: 'Nueva Factura',
      prices: 'Precios',
      priceProfiles: 'Perfil de Precios',
      lookupLists: 'Lista de Búsquedas',
      addressFields: 'Campos de Dirección',
      loadDB: 'Cargar Base de Datos',
      users: 'Usuarios',
      newUser: 'Nuevo Usuarios',
      admittedPatients: 'Pacientes Admitidos',
      missed: 'Perdido',
      userRoles: 'Perfiles de Usuarios',
      workflow: 'Workflow'
    },
    actions: {
      logout: 'Salir',
      login: 'Entrar'
    },
    about: 'Acerca de HospitalRun'
  },
  user: {
    plusNewUser: '+ Nuevo Usuario',
    usersPageTile: 'Lista de Usuarios'
  },
  admin: {
    addressOptions: 'Opciones de direcciones',
    lookupLists: 'Lista de búsqueda',
    loadDb: 'Cargar Base de datos',
    userRoles: 'Roles',
    users: 'Usuarios',
    address: {
      address1Label: 'Texto direccion 1',
      address2Label: 'Texto direccion 2',
      address3Label: 'Texto direccion 3',
      address4Label: 'Texto direccion 4',
      include1Label: 'Incluir 1',
      include2Label: 'Incluir 2',
      include3Label: 'Incluir 3',
      include4Label: 'Incluir 4',
      titles: {
        optionsSaved: 'Opciones Guardadas'
      },
      messages: {
        addressSaved: 'Las opciones de dirección han sido guardadas'
      },

      newTitle: 'Opciones de dirección',
      editTitle: 'Opciones de dirección',
      addressLabel: 'Dirección'
    },
    loaddb: {
      progressMessage: 'Por favor espere mientras la base de datos es cargada.',
      progressTitle: 'Cargando base de datos',
      displayAlertTitle: 'Seleccione un archivo para cargar',
      displayAlertMessage: 'Por favor seleccione un archivo para ser cargado.',
      errorDisplayAlertTitle: 'Error al cargar',
      errorDisplayAlertMessage: 'La base de datos no fue cargada el error fue: {{error}}',
      editTitle: 'Cargar bd'
    },
    lookup: {
      deleteValueInventoryTypeMedicationTitle: 'No se puede eliminar el medicamento',
      deleteValueInventoryTypeMedicationMessage: 'El tipo de inventario de medicamentos no se pueden eliminar porque se necesita para el módulo de medicación.',
      deleteValueLabPricingTypeProcedureTitle: 'No se puede eliminar el tipo de precio',
      deleteValueLabPricingTypeProcedureMessage: 'El tipo de precio del procedimiento de laboratorio no se puede eliminar porque es necesaria para el módulo de laboratorios.',
      deleteValueImagingPricingTypeProcedureTitle: 'No se puede eliminar el tipo de imagen',
      deleteValueImagingPricingTypeProcedureMessage: 'No se puede eliminar porque es necesario para el módulo de radiografías',
      deleteValueVisitTypeAdmissionTitle: 'No se puede eliminar admisión tipo visita',
      deleteValueVisitTypeAdmissionMessage: 'Tipo de visita es necesaria para el módulo de admisiones.',
      deleteValueVisitTypeImagingTitle: 'No se puede eliminar el tipo radiografía',
      deleteValueVisitTypeImagingMessage: 'No se puede eliminar por que es necesario para el módulo de radiografías.',
      deleteValueVisitTypeLabTitle: 'No se puede eliminar el tipo laboratorio',
      deleteValueVisitTypeLabMessage: 'Es necesario para el módulo de laboratorio.',
      deleteValueVisitTypePharmacyTitle: 'No se puede eliminar el tipo farmacia',
      deleteValueVisitTypePharmacyMessage: 'Es requerido por el módulo de recetas.',
      alertImportListTitle: 'Seleccione un archivo para importar',
      alertImportListMessage: 'Por favor seleccione un archivo para importar.',
      alertImportListSaveTitle: 'Lista importada',
      alertImportListSaveMessage: 'Lista de búsqueda importada.',
      alertImportListUpdateTitle: 'Lista guardada',
      alertImportListUpdateMessage: 'La lista de búsqueda ha sido guardada.',
      pageTitle: 'Listas de búsqueda',
      edit: {
        template: {
          addTitle: 'Agregar valor',
          editTitle: 'Editar valor',
          updateButtonTextAdd: 'Agregar',
          updateButtonTextUpdate: 'Actualizar',
          labelTitle: 'Valor'
        }
      },
      anesthesiaTypes: 'Tipos de anestesia',
      anesthesiologists: 'Anestesiólogo',
      billingCategories: 'Categorías de facturación',
      clinicList: 'Ubicación de las clínicas',
      countryList: 'Países',
      diagnosisList: 'Diagnósticos',
      cptCodeList: 'Códigos CPT',
      expenseAccountList: 'Cuentas de gastos',
      aisleLocationList: 'Ubicación de inventario de pasillo',
      warehouseList: 'Ubicaciones de inventarios',
      inventoryTypes: 'Tipos de inventarios',
      imagingPricingTypes: 'Tipos de precios de radiografías',
      labPricingTypes: 'Precios de laboratorio',
      patientStatusList: 'Lista de estado de pacientes',
      physicianList: 'Médicos',
      procedureList: 'Procedimientos',
      procedureLocations: 'Ubicación de los procedimientos',
      procedurePricingTypes: 'Tipos de procedimientos y precios',
      radiologists: 'Radiólogo',
      unitTypes: 'Tipos de unidad',
      vendorList: 'Proveedor',
      visitLocationList: 'Lugares de visita',
      visitTypes: 'Tipos de visita',
      wardPricingTypes: 'Tipos de precios de enfermería'
    },
    roles: {
      capability: {
        admin: 'Administración',
        loadDb: 'Cargar base de datos',
        updateConfig: 'Actualizar configuración',
        appointments: 'Citas',
        addAppointment: 'Agregar cita',
        billing: 'Facturación',
        addCharge: 'Agregar cargo (valor)',
        addPricing: 'Agregar precio',
        addPricingProfile: 'Agregar perfil de precios',
        addInvoice: 'Agregar factura',
        addPayment: 'Agregar pago',
        deleteInvoice: 'Eliminar factura',
        deletePricing: 'Eliminar precio',
        deletePricingProfile: 'Eliminar perfil de precio',
        editInvoice: 'Editar Factura',
        invoices: 'Facturas',
        overrideInvoice: 'Sobreescribir Factura',
        pricing: 'Precio',
        patients: 'Pacientes',
        addDiagnosis: 'Agregar diagnóstico',
        addPhoto: 'Agregar foto',
        addPatient: 'Agregar paciente',
        addVisit: 'Agregar visita',
        addVitals: 'Agregar partes vitales',
        admitPatient: 'Admitir paciente',
        deletePhoto: 'Eliminar foto',
        deletePatient: 'Eliminar paciente',
        deleteAppointment: 'Eliminar cita',
        deleteDiagnosis: 'Eliminar diagnóstico',
        deleteProcedure: 'Eliminar procedimiento',
        deleteSocialwork: 'Eliminar trabajo social',
        deleteVitals: 'Eliminar organo vital',
        deleteVisit: 'Eliminar visita',
        dischargePatient: 'Descartar paciente',
        patientReports: 'Reportes por paciente',
        visits: 'Visitas',
        medication: 'Medicación',
        addMedication: 'Agregar medicación',
        deleteMedication: 'Eliminar medicación',
        fulfillMedication: 'Cumplir la medicación',
        labs: 'Laboratorios',
        addLab: 'Agregar laboratorio',
        completeLab: 'Completar laboratorio',
        deleteLab: 'Eliminar laboratorio',
        imaging: 'Radiografía',
        addImaging: 'Agregar radiografía',
        completeImaging: 'Completar radiografía',
        deleteImaging: 'Eliminar radiografía',
        inventory: 'Inventario',
        addInventoryRequest: 'Pedido de inventario',
        addInventoryItem: 'Agregar elemento al inventario',
        addInventoryPurchase: 'Agregar compra',
        adjustInventoryLocation: 'Ajustar lugar elemento en el inventario',
        deleteInventoryItem: 'Eliminar elemento del inventario',
        deleteInventoryPurchase: 'Eliminar compra del inventario',
        fulfillInventory: 'Cumplimiento de inventario',
        userRoles: 'Perfiles de usuario'
      },
      messages: {
        roleSaved: 'El {{roleName}} perfil ha sido guardado.'
      },
      titles: {
        roleSaved: 'Perfil guardado'
      }
    },
    workflow: {
      admissionDepositLabel: 'Depósito de admisión obligatorio',
      clinicPrepaymentLabel: 'Pago anticipado a la clínica obligatorio',
      followupPrepaymentLabel: 'Pago anticipado de segimiento obligatorio',
      outpatientLabLabel: 'Pago anticipado de laboratorio para paciente externo obligatorio',
      outpatientImagingLabel: 'Pago anticipado de radiografía para paciente externo obligatorio',
      outpatientMedicationLabel: 'Pago anticipado de medicación para paciente externo obligatorio',

      titles: {
        optionsSaved: 'Opciones Guardadas'
      },
      messages: {
        optionsSaved: 'Las opciones de flujo de trabajo han sido guardadas'
      },

      newTitle: 'Opciones de flujo de trabajo',
      editTitle: 'Opciones de flujo de trabajo',
      workflowLabel: 'Flujo de trabajo'

    }
  },
  labels: {
    cptcode: 'Código CPT',
    loading: 'Cargando',
    name: 'Nombre',
    patient: 'Paciente',
    quantity: 'Cantidad',
    requestedOn: 'Pedido En',
    date: 'Fecha',
    dateOfBirth: 'Fecha de nacimiento',
    dateOfBirthShort: 'FDN',
    dateRequested: 'Fecha de pedido',
    dateCompleted: 'Fecha completada',
    description: 'Descripción',
    requestedBy: 'Pedido por',
    fulfill: 'Cumplimiento',
    fulfillRequest: 'Pedido de cumplimiento',
    fulfillRequestNow: 'Pedido de cumplimiento ahora',
    actions: 'Acciones',
    action: 'Acción',
    notes: 'Notas',
    edit: 'Editar',
    imageOrders: 'Órdenes de radiografías',
    labOrders: 'Órdenes de laboratorio',
    patientHistory: 'Historia del paciente',
    imagingType: 'Tipo de radiografía',
    result: 'Resultado',
    results: 'Resultados',
    visit: 'Visita',
    requests: 'Pedido',
    completed: 'Completado',
    requests: 'Solicitudes',
    completed: 'Completado',
    id: 'Id',
    on: 'en',
    type: 'Tipo',
    sex: 'Genero',
    age: 'Edad',
    search: 'Buscar',
    username: 'Nombre de usuario',
    email: 'Email',
    role: 'Perfil',
    delete: 'Eliminar',
    userCanAddNewValue: 'Los usuarios pueden agregar nuevos valores',
    value: 'Valor',
    lookupType: 'Tipo de búsqueda',
    importFile: 'Importar archivo',
    fileLoadSuccessful: 'Archivo cargado exitosamente',
    fileToLoad: 'Archivo cargado',
    startTime: 'Hora de inicio',
    startDate: 'Fecha de inicio',
    endTime: 'Hora de finalización',
    endDate: 'Fecha final',
    docRead: 'Leer documento',
    docWritten: 'Documento escrito',
    displayName: 'Nombre para mostrar',
    password: 'Contraseña',
    editUser: 'Editar usuario',
    newUser: 'Nuevo usuario',
    deleteUser: 'Eliminar usuario',
    medication: 'Medicación',
    status: 'Estado',
    addNewOutpatientVisit: '--Nueva visita a paciente externo--',
    prescription: 'Receta médica',
    prescriptionDate: 'Fecha de la receta médica',
    billTo: 'Facturar a',
    pullFrom: 'Traer de',
    fulfilled: 'Cumplido',
    deleteRequest: 'Eliminar pedido',
    location: 'Ubicación',
    provider: 'Proveedor',
    with: 'con',
    allDay: 'Todo el día',
    physician: 'Médico',
    assisting: 'Asistencia',
    anesthesia: 'Anestesia',
    procedures: 'Procedimiento'
    procedures: 'Procedimientos',
    number: 'Número',
    billDate: 'Fecha Factura',
    balanceDue: 'Saldo Vencido',
    amount: 'Monto',
    datePaid: 'Fecha de Pago',
    creditTo: 'Crédito a',
    invoiceId: 'Factura ID',
    lineItems: 'Artículos de línea',
    discount: 'Descuento',
    excess: 'Excedente',
    price: 'Precio',
    total: 'Total',
    expenseTo: 'Gasto para',
    grandTotal: 'Gran Total',
    remarks: 'Observaciones',
    payments: 'Pagos',
    category: 'Categoría',
    department: 'Departmento',
    address: 'Dirección',
    country: 'País'
  },
  messages: {
    noItemsFound: 'Elementos no encontrados.',
    noHistoryAvailable: 'Historia no disponible.',
    createNewRecord: '¿Crear un nuevo registro?',
    createNewUser: '¿Crear un nuevo usuario?',
    noUsersFound: 'Ningun usuario encontrado.',
    areYouSureDelete: '¿Estas seguro de eliminar este usuario {{user}}?',
    userHasBeenSaved: 'El usuario ha sido guardado.',
    userSaved: 'Usuario guardado',
    onBehalfOf: 'a nombre de',
    newPatientHasToBeCreated: 'Un nuevo paciente debe ser creado... Por favor espere..',
    noNotesAvailable: 'No hay notas clínicas adicionales están disponibles para esta visita.',
    sorry: 'Lo sentimos, un error ha ocurrido...',
    forAuthorizedPersons: 'Este informe es sólo para personas autorizadas.'
  },
  alerts: {
    pleaseWait: 'Por favor espere'
  },
  headings: {
    chargedItems: 'Elementos Cargados'
  },
  buttons: {
    addItem: 'Agregar Elemento',
    complete: 'Completado',
    cancel: 'Cancelar',
    close: 'Cerrar',
    returnButton: 'Regresar',
    barcode: 'Código de barras',
    add: 'Agregar',
    update: 'Actualizar',
    ok: 'Ok',
    fulfill: 'Cumplimiento',
    remove: 'Remover',
    delete: 'Eliminar',
    newUser: 'Nuevo usuario',
    addValue: 'Agregar valor',
    newNote: 'Nueva nota',
    import: 'Importar',
    loadFile: 'Cargar archivo',
    newRequest: 'Nueva solicitud',
    allRequests: 'Todas las solicitudes',
    dispense: 'Repartir',
    newItem: '+ nuevo elemento',
    newRequestPlus: '+ nuevo pedido',
    addVisit: 'Agregar visita',
    search: 'Buscar'
    edit: 'Editar',
    addLineItem: 'Agregar elemento de línea'
  },
  login: {
    messages: {
      signIn:  'por favor ingrese',
      error:    'Nombre de usuario o clave incorrectos.'
    },
    labels: {
      password: 'Contraseña',
      username: 'Usuario',
      signIn:  'Entrar'
    }
  },
  loading: {
    progressBar: {
      progress: '{{progressBarValue}}% Completado'
    },
    messages: {
      0: 'La velocidad de vuelo de las mariposas es de 12 millas por hora. ¡Algunas mariposas pueden volar 25 millas por hora!',
      1: 'Los búhos son las únicas aves que pueden ver el color azul.',
      2: 'Los gatos tienen más de 100 sonidos vocales; Sólo los perros tienen 10.',
      3: 'Los seres humanos utilizan un total de 72 músculos diferentes en el habla.',
      4: 'Más de 1.000 lenguas diferentes se hablan en el continente de África.',
      5: 'Un eritrofobico es alguien que se sonroja con facilidad.',
      6: 'La fobia más común en el mundo es la algofobia que es el miedo al dolor.',
      7: 'Tu cuerpo utiliza 300 músculos para equilibrarse cuando está de pie.',
      8: 'Ciertas ranas pueden ser sólido congelado se descongela a continuación, y seguir viviendo.',
      9: 'Nuestros ojos son siempre del mismo tamaño desde que nacemos, pero nuestra nariz y orejas nunca dejan de crecer.',
      10: 'ST lengua es el único músculo en tu cuerpo que está unida en un solo extremo.',
      11: 'Los camellos tienen tres párpados para protegerse de las tormentas de arena.'
    }
  },
  inventory: {
    edit: {
      cost: 'Costo por unidad:',
      delivered: 'Enviado A:',
      location: 'Cambio de ubicación:',
      prescription: 'Recetado por:',
      pulled: 'Retirado de:',
      quantity: 'Cantidad de finalización:',
      reason: 'Razón:',
      returned: 'Regresado al paciente:',
      transferredFrom: 'Transferido de:',
      transferredTo: 'Transferido a:'
    },
    labels: {
      action: 'Acción',
      add: 'Agregar',
      adjust: 'Ajustar',
      adjustmentDate: 'Fecha de ajuste',
      adjustmentFor: 'Ajustado para',
      adjustmentType: 'Tipo de ajuste',
      aisle: 'Pasillo',
      aisleLocation: 'Ubicación pasillo',
      allInventory: 'Todo el inventario',
      billTo: 'Facturado a',
      consumePurchases: 'Compras para consumo',
      consumptionRate: 'Tasa de consumo',
      cost: 'Costo',
      costPerUnit: 'Costo por Unidad',
      crossReference: 'Referencia cruzada',
      currentQuantity: 'Cantidad actual',
      dateCompleted: 'Fecha completado',
      dateEffective: 'Fecha efectiva',
      dateEnd: 'Fecha final',
      dateStart: 'Fecha inicial',
      dateReceived: 'Fecha recibido',
      dateTranferred: 'Fecha transferencia',
      daysLeft: 'Días restantes',
      deliveryAisle: 'Enviado a pasillo',
      deliveryLocation: 'Ubicación del envio',
      distributionUnit: 'Unidad de distribución',
      deleteItem: 'Eliminar elemento',
      details: 'Detalles',
      editItem: 'Editar elemento',
      expense: 'Gastos a',
      expirationDate: 'Fecha de vencimiento',
      fulfillRequest: 'Pedido de cumplimiento',
      fulfillRequestNow: 'Pedido de incumplimiento para hoy',
      gift: 'Regalo en especie',
      giftUsage: 'Uso del regalo en especie',
      giftInKindNo: 'N',
      giftInKindYes: 'Y',
      inventoryConsumed: 'Inventario consumido',
      inventoryItem: 'Elemento del inventario',
      inventoryObsolence: 'Obsolescencia de inventario',
      invoiceItems: 'Articulos de factura',
      invoiceLineItem: 'Elemento de la factura línea',
      invoiceNumber: 'Factura número',
      item: 'Elemento',
      items: 'Elementos',
      itemNumber: 'Número de elemento',
      location: 'Ubicación',
      locations: 'Ubicaciones',
      name: 'Nombre',
      markAsConsumed: 'Marcar como consumido',
      newItem: 'Nuevo elemento',
      originalQuantity: 'Cantidad original',
      print: 'Imprimir',
      printBarcode: 'Imprimir código de  barras',
      printer: 'Impresora',
      pullFrom: 'Traído de',
      purchases: 'Compras',
      purchaseCost: 'Costo de compra',
      purchaseInfo: 'Información de la compra',
      quantity: 'Cantidad ({{unit}})',
      quantityAvailable: 'Cantidad disponible',
      quantityOnHand: 'Cantidad a la mano',
      quantityRequested: 'Cantidad pedida',
      rank: 'Ranking',
      reason: 'Razón',
      remove: 'Remover',
      reorderPoint: 'Reordenar punto',
      requestedItems: 'Elementos solicitados',
      salePricePerUnit: 'Costo de venta por unidad',
      save: 'Guardar',
      serialNumber: 'Serial/Número de lote',
      serialNumber: 'Serial/Número de lote',
      total: 'Total',
      totalCost: 'Costo total',
      totalReceived: 'Total Recivido: {{total}}',
      transaction: 'Transaccion',
      transactions: 'Transacciones',
      transfer: 'Translados',
      transferFrom: 'Translado desde',
      transferTo: 'Translado a ubicación',
      transferToAisle: 'Translado a pasillo',
      unit: 'Unidad',
      unitCost: 'Unidad Costo',
      vendor: 'Proveedor',
      vendorItemNumber: 'Proveedor número de elemento',
      xref: 'XRef'
    },
    messages: {
      adjust: 'Por favor ajust las cantidades en la ubicación adecuada(s) la diferencia de la cuenta es {{difference}}.',
      createRequest: 'Crear un nuevo pedido?',
      delete: 'Estas seguro de eliminar {{name}}?',
      itemNotFound: 'El elemento del inventario <strong>{{item}}</strong> no se pudo encontrar.<br>Si desea crear un nuevo elemento, Ingrese la información abajo.<br>De lo contrario opria cancelar para volver.',
      loading: 'Cargando transacciones ...',
      purchaseSaved: 'La compra de inventario ha sido salvada.',
      noRequests: 'No se encontraron pedidos.',
      noItems: 'No se encontraron elementos.',
      quantity: 'La cantidad total <strong>({{quantity}})</strong> no concuerda con la cantidad total en las ubicaciones <strong>({{locationQuantity}})</strong>.',
      removeItem: 'Esta seguro de eliminar este elemento de la factura?',
      removeItemRequest: 'Seguro que quiere eliminar este elemento del pedido?',
      requestFulfilled: 'El pedido de inventario ha sido procesado.',
      requestUpdated: 'El pedido de inventario ha sido actualizado.',
      warning: 'Por favor valide los campos requeridos (marcados con *) corrija los errores antes de agregar.'
    },
    reports: {
      rows: {
        adjustments: 'Ajustes',
        adjustmentsTotal: 'Ajustes Totales',
        balanceBegin: 'Balance inicial',
        balanceEnd: 'Balance Final',
        category: 'Categoría',
        consumed: 'Consumado',
        consumedGik: 'GiK Consumido',
        consumedGikTotal: 'Total GiK Consumido',
        consumedPuchases: 'Compras consumidas',
        consumedPurchasesTotal: 'Total de compras consumido',
        consumedTotal: 'Total consumido',
        errInFinSum: 'Error en _generateFinancialSummaryReport: ',
        errInFindPur: 'Error en _findInventoryItemsByPurchase: ',
        errInFindReq: 'Error en _findInventoryItemsByRequest: ',
        expensesFor: 'Gastos para: ',
        noAccount: '(No hay Cuenta)',
        subtotal: 'Subtotal: ',
        subtotalFor: 'Subtotal para {{category}} - {{account}}: ',
        total: 'Total: ',
        totalFor: 'Total para {{var}}: ',
        totalPurchases: 'Compras Totales',
        transfer1: '{{quantity}} de {{location}}',
        trasnfer2: 'De: {{source}} A: {{target}}'
      },
      adjustment: 'Ajuste detallado',
      daysSupply: 'Dias de inventario restante',
      expenseDetail: 'Gastos detallados',
      expenseSum: 'Resumen de gastos',
      expiration: 'Fecha de expiracion',
      export: 'Exportar Reporte',
      fields: 'Campos a incluir',
      finance: 'Resumen de finanzas',
      generate: 'Generar reporte',
      invLocation: 'Inventario Por Ubicación',
      invValuation: 'Inventario por valoración',
      purchaseDetail: 'Compras Detalladas',
      purchaseSum: 'Resumen de Compras',
      reportType: 'Tipo de reporte',
      stockTransferDetail: 'Detalle de traslados',
      stockTransferSum: 'Resumen traslados',
      stockUsageDetail: 'Detalle de Uso',
      stockUsageSum: 'Resumen de Uso'
    },
    titles: {
      addPurchase: 'Agregar Compra',
      addRequest: 'Nuevo Pedido',
      adjustment: 'Ajuste',
      editPurchase: 'Editar Compra',
      editRequest: 'Editar Pedido',
      inventoryItem: 'Nuevo Elemento de Inventario',
      inventoryReport: 'Reporte de Inventario',
      purchaseSaved: 'Compras de Inventario Guardadas',
      quickAddTitle: 'Nuevo Eelemento de Inventario',
      removeItem: 'Remover Elemento',
      requestFulfilled: 'Pedido Cumplido',
      requestUpdated: 'Pedido Actualizado',
      transfer: 'Transferencia de Elementos',
      warning: '¡Advertencia!'
    }
  },
  imaging: {
    pageTitle: 'Pedido de radriografia',
    sectionTitle: 'Radiografias',
    buttons: {
      newButton: '+ new radiografía'
    },
    labels: {
      radiologist: 'Radiólogo',
      addNewVisit: '--Agregar nueva visita--'
    },
    messages: {
      delete: 'Esta seguro de que desea eliminar esta solicitud de radiografía ?',
      noCompleted: 'No se encontrarón los elementos terminados.'
    },
    titles: {
      completedImaging: 'Radiografía completada',
      editTitle: 'Pedido de edicion de radiografía',
      newTitle: 'Nuevo pedido de radiografía'
    },
    alerts: {
      completedTitle: 'Pedido de radiografía completado',
      completedMessage: 'El pedido de radiografía ha sido completado.',
      savedTitle: 'Pedido de radiografía salvado',
      savedMessage: 'El pedido de radiografía ha sido guardado.'
    }
  },
  medication: {
    pageTitle: 'Solicitud de Medicación',
    sectionTitle: 'Medicación',
    returnMedication: 'Retorno de Medicación',
    buttons: {
      dispenseMedication: 'dispensar medicación',
      newButton: '+ nuevo pedido',
      returnMedication: 'debolver medicacion'
    },
    titles: {
      completedMedication: 'Medicación Completada',
      editMedicationRequest: 'Editar Pedido de Medicación',
      newMedicationRequest: 'Nuevo pedido de Medicación'
    },
    messages: {
      createNew: 'Crear un nuevo pedido de medicacion?',
      confirmDeletion: '¿Estás seguro de eliminar este pedido de medicación?'
    },
    labels: {
      refills: 'Recargas',
      quantityRequested: 'Cantidad Solicitada',
      quantityDispensed: 'Cantidad Dispensada',
      quantityDistributed: 'Cantidad Distribuida',
      quantityToReturn: 'Cantidad a Devolver',
      returnLocation: 'Retornar Ubicación',
      returnAisle: 'Devolve Pasillo',
      returnReason: 'Motivo de Devoluciones/Notas',
      adjustmentDate: 'Fecha de Ajuste',
      creditToAccount: 'Credito a Cuenta'
    },
    alerts: {
      returnedTitle: 'Medicamento Devuelto',
      returnedMessage:  'El medicamento  ha sido marcado para devolver.',
      savedTitle: 'Solicitud de Medicamento Guardada',
      savedMessage: 'El registro de tratamiento ha sido guardado.',
      fulfilledTitle: 'Solicitud de medicamento cumplido'
    }
  },
  appointments: {
    currentScreenTitle: 'Listado de citas',
    editTitle: 'Editar cita',
    newTitle: 'Nueva cita',
    sectionTitle: 'Citas',
    thisWeek: 'Citas Esta Semana',
    missed: 'Citas Perdidas',
    searchTitle: 'Buscar Citas',
    todayTitle: 'Citas para hoy',
    messages: {
      deleteAppointmentMessage: 'Esta seguro de eliminar esta cita?',
      endTimeLaterThanStart: 'Seleccione una hora de finalizacion despues de la de inicio.'
    },
    buttons: {
      newButton: '+ nueva cita'
    },
    labels: {
      selectedStartingDate: 'Mostrar Citas Actuales o Futuras'
    }
  },
  vitals: {
    messages: {
      delete: '¿Está seguro de que desea eliminar estos signos vitales?'
    },
    labels: {
      dateRecorded: 'Fecha Guardada',
      temperature: 'Temperatura',
      weight: 'Peso',
      height: 'Altura',
      sbp: 'SBP',
      dbp: 'DBP',
      heartRate: 'Ritmo Cardiaco',
      respiratoryRate: 'Ritmo Respiratorio'
    }
  },
  visits: {
    titles: {
      additionalDiagnoses: 'Diagnósticos Adicionales'
    },
    messages: {
      delete: '¿Esta seguro que desea eliminar esta visita?'
    },
    buttons: {
      newProcedure: 'Nuevo Procedimiento',
      newLab: 'Nuevo Estudio',
      newAppointment: 'Nueva Cita',
      addDiagnosis: 'Agregar Diagnóstico',
      newImaging: 'Nueva Radiografía',
      newMedication: 'Nuevo Tratamiento',
      newVitals: 'Nuevos Signos Vitales'
    },
    labels: {
      diagnosis: 'Diagnóstico',
      procedure: 'Procedimiento',
      procedureDate: 'Fecha de Procedmiento',
      authoredBy: 'Autorizado por',
      labs: 'Laboratorios',
      imaging: 'Radiografías',
      visitInformation: 'Información de visitas',
      examiner: 'Examinador',
      medication: 'Tratamiento',
      status: 'Estatus de la Visita',
      admittingDiagnosis: 'Diagnóstico de Admisión',
      finalDiagnosis: 'Diagnóstico Final / Facturación',
      visitDate: 'Fecha de Visita',
      visitType: 'Tipo de Visita',
      vitals: 'Partes Vitales'
    }
  },
  labs: {
    sectionTitle: 'Laboratorios',
    requestsTitle: 'Pedido de Laboratorio',
    editTitle: 'Editar pedido de Laboratorio',
    newTitle: 'Nuevo pedido de Laboratorio',
    deleteTitle: 'Eliminar Pedido',
    completedTitle: 'Completar Laboratorio',
    labels: {
      labType: 'Tipo de Laboratorio',
      addNewVisit: '--Adicionar Nueva Visita--'
    },
    messages: {
      noItemsFound: 'Laboratorios no encontrados.',
      createNewRecord: '¿Crear un nuevo registro?',
      confirmDeletion: '¿Está seguro de eliminar esta solicitud de laboratorio?',
      noCompleted: 'No se encontraron elementos completados.'
    },
    buttons: {
      newButton: '+ Nuevo Laboratorio'
    },
    alerts: {
      requestCompletedTitle: 'Solicitud de Laboratorio Completado',
      requestCompletedMessage: 'La solicitud de Laboratorio ha sido completada.',
      requestSavedTitle: 'Solicitud de Laboratorio guardada',
      requestSavedMessage: 'La solicitud de Laboratorio ha sido guardada'
    }
  },
  patients: {
    navigation: {
      photos: 'Fotos',
      general: 'General',
      history: 'Historial',
      appointments: 'Citas',
      visits: 'Visitas',
      medication: 'Tratamiento',
      imaging: 'Radiografías',
      labs: 'Laboratorios',
      socialWork: 'Trabajo Social'
    },
    titles: {
      admittedPatients: 'Pacientes Admitidos',
      expenses: 'Gastos',
      additionalContacts: 'Contactos Adicionales',
      familyInformation: 'Información Familiar',
      delete: 'Eliminar Paciente',
      new: 'Nuevo Paciente',
      edit: 'Editar Paciente',
      patient: 'Reporte de Paciente',
      patientListing: 'Listado de Pacientes',
      patientReport: 'Reporte del Paciente',
      addPhoto: 'Agregar Foto',
      editPhoto: 'Editar Foto',
      socialWork: 'Gasto',
      familyInfo: 'Información Familiar',
      deleteFamilyMember: 'Eliminar Miembro de Familia ',
      deleteExpense: 'Eliminar Gasto',
      deletePhoto: 'Eliminar Foto',
      deleteContact: 'Eliminar Contacto',
      savedPatient: 'Paciente Registrado',
      admissionsDetail: 'Detalles de Admisión',
      admissionsSummary: 'Resumen de Admisiones',
      diagnosticTesting: 'Prueba de Diagnóstico',
      dischargesDetail: 'Detalles de Rehabilitación',
      dischargesSummary: 'Resumen de Rehabilitación',
      proceduresDetail: 'Detalles de Procedimientos',
      proceduresSummary: 'Resumen de Procedimientos',
      patientStatus: 'Estatus del Paciente',
      totalPatientDays: 'Estancia Total Del Paciente ',
      totalPatientDaysDetailed: 'Estancia Total Del Paciente (Detallado)',
      visit: 'Visita',
      deletePatientRecord: 'Eliminar Registro Del Paciente'
    },
    messages: {
      areYouSureDelete: '¿Está seguro que desea eliminar este {{object}}?',
      deletePatient: '¿Está seguro que desea eliminar  a {{firstName}} {{lastName}}?',
      noPatientsFound: 'No se encontraron pacientes.',
      savedPatient: 'El registro del paciente {{displayName}} ha sido guardado.',
      notFoundQuickAdd: 'El paciente <strong>{{patientFullName}}</strong> no pudo ser encontrado. Si gusta crear un nuevo paciente llene la información de abajo.  De otra manera presione el boton Cancelar para regresar.',
      createNewPatient: '¿Crear un nuevo registro de paciente?',
      deletingPatient: 'Eliminando paciente y todos los registros asociados a él'
    },
    buttons: {
      addExpense: 'Agregar Gasto',
      addContact: 'Agregar Contacto',
      newLab: 'Nuevo Laboratorio',
      newVisit: 'Nueva  Visita',
      newMedication: 'Nuevo Tratamiento',
      newImaging: 'Nueva Radiografía',
      addFamilyMember: 'Agregar Miembro de Familia',
      newPhoto: 'Nueva Foto',
      newAppointment: 'Nueva Foto',
      backToPatients: 'Regresar a La Lista De Pacientes',
      newPatient: '+ nuevo paciente'
    },
    headings: {
      history: 'Historia',
      historySince: 'Desde la Historia'
    },
    labels: {
      primaryDiagnosis: 'Diagnósticos Primarios',
      secondaryDiagnosis: 'Diagnósticos Secundarios',
      monthlyCost: 'Costo Mensual',
      totalMontlyExpense: 'Total de Gastos Mensuales',
      patientType: 'Tipo de Paciente',
      admissionDate: 'Fecha de Admisión',
      patientDays: 'Días De Estancia',
      dischargeDate: 'Fecha de Reahbilitación',
      discharge: 'Rehabilitación',
      admit: 'Admitir',
      relationships: 'Relaciones',
      phone: 'Telefono',
      email: 'Email',
      firstName: 'Nombre',
      middleName: 'Segundo Nombre',
      lastName: 'Apellido(s)',
      sex: 'Sexo',
      dob: 'Fec. Nac.',
      dateOfBirth: 'Fecha de Nacimiento',
      placeOfBirth: 'Lugar de Nacimiento',
      sources: 'fuentes',
      costs: 'Costos',
      civilStatus: 'Estado Civil',
      relationship: 'Relación con el paciente',
      education: 'Educación',
      occupation: 'Ocupación',
      income: 'Ingresos',
      insurance: 'Seguro',
      dateProcessed: 'Fecha Procesado',
      status: 'Estatus del Paciente',
      externalPatientId: 'Número de Identificación del Paciente Externo',
      bloodType: 'Tipo de Sangre',
      clinic: 'Sitio Clinico',
      referredBy: 'Referido por',
      referredDate: 'Fecha Referida',
      religion: 'Religión',
      parent: 'Pariente/Tutor',
      contacts: 'Contacto(s)',
      sexNotEntered: 'Sexo No Registrado'
    },
    notes: {
      newNote: 'Nueva Nota Para',
      updateNote: 'Actualizando Nota De',
      onBehalfOfLabel: 'A nombre de',
      onBehalfOfCopy: 'A nombre de',
      pleaseSelectAVisit: 'Por favor seleccione una visita'
    }
  },
  billing: {
    alerts: {
      noInvoiceFound: 'No se encontraron facturas',
      deleteItem: '¿Está seguro de que desea eliminar este {{item}}?',
      noPricingItems: 'No se encontró lista de precios.',
      noPricingProfiles: 'No se encontraron perfiles de precios'
    },
    buttons: {
      createInvoice: '¿Crear una factura?',
      addOverride: 'Agregar anulazión'
    },
    labels: {
      externalInvoiceNumber: 'Factura Externa #',
      paymentProfile: 'Perfil de Pago',
      actualCharges: 'Cargos Actuales',
      insurance: 'Seguro Nacional',
      hmoCom: 'HMO/COM',
      paymentsDeposits: 'Pagos/Depositos',
      pricingPanelOverrides: 'Anulaciones de Perfil de Precio',
      pricingProfile: 'Perfil de Precio',
      discountAmount: 'Monto de Descuento',
      discountPercentage: 'Porcentaje de Descuento'
    }
  },
  print: {
    invoice: {
      labels: {
        patientName: 'NOMBRE DEL PACIENTE:',
        patientId: 'PACIENTE #:',
        patientAge: 'EDAD:',
        patientAddress: 'DIRECCIÓN:',
        dateAdmitted: 'ADMITIDO:',
        dateDischarged: 'PAGO:',
        dischargeNotes: 'Notas de Pago:',
        remarks: 'Observaciones:',
        billedBy: 'Facturado por:',
        billedDate: 'Fecha de Factura:',
        spacer: '__________________________________________'
      },
      messages: {
        whereConducted: 'fueron deducidos durante mi confinamiento'
      },
      titles: {
        patientMember: 'Miembro del Paciente',
        relContact: 'Parentesco / Número de contacto',
        patients: 'PACIENTE',
        billingStatement: 'ESTADO DE CUENTA'
      }
    }
  },
  procedures: {
    titles: {
      addChargeItem: 'Agregar Cargo',
      deleteChargeItem: 'Eliminar Cargo',
      editChargeItem: 'Editar Cargo',
      medicationUsed: 'Tratamiento Resetado',
      deleteMedicationUsed: 'Eliminar Tratamiento Resetado',
      addMedicationUsed: 'Agregar Medicamento Utilizado',
      editMedicationUsed: 'Editar Medicamento Utilizado',
      edit: 'Editar Procedimiento',
      saved: 'Procedimiento Guardado',
      new: 'Nuevo Procedimiento'
    },
    labels: {
      medicationUsed: 'Medicamento Utilizado'
    },
    messages: {
      deleteMedication: '¿Está seguro que desea eliminar este tratamiento?',
      delete: '¿Está seguro que desea eliminar este procedimiento?',
      saved: 'El registro del procedimiento ha sido guardado.'
    },
    buttons: {
      addMedication: 'Agregar Medicamento'
    }
  },
  components: {
    chargesByTypeTab: {
      charges: 'cargos'
    },
    takePhoto: {
      how: '¿Como desea agregar una foto?',
      takePhoto: 'Tomar Foto',
      uploadPhoto: 'Actualizar Foto',
      uploadFile: 'Actualizar Archivo',
      camera: 'Cámara',
      photo: 'Foto',
      preview: 'vista anticipada'
    },
    quantityConv: {
      unit: 'Unidad',
      conversion: '¿Que contiene 1 {{name}}?'
    },
    quantityCalc: {
      result: '{{targetUnit}} total: {{calculated}}'
    },
    priceList: {
      charges: '{{pricingType}} cargos'
    }
  }
};
