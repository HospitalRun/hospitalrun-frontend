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
      deleteValueLabPricingTypeProcedureMessage: 'El tipo de precio procedimiento de laboratorio no se puede eliminar porque es necesaria para el módulo de laboratorios.',
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
        optionsSaved: 'Las opciones de workflow han sido guardadas'
      },

      newTitle: 'Opciones de Workflow',
      editTitle: 'Opciones de Workflow',
      workflowLabel: 'Workflow'

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
    number: 'Numero',
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
      billTo: 'Facturao a',
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
      serialNumber: 'Serial/Numero de lote',
      serialNumber: 'Serial/Lot Number',
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
      adjust: 'Please adjust the quantities on the appropriate location(s) to account for the difference of {{difference}}.',
      createRequest: 'Create a new request?',
      delete: 'Are you sure you wish to delete {{name}}?',
      itemNotFound: 'The inventory item <strong>{{item}}</strong> could not be found.<br>If you would like to create a new inventory item, fill in the information below.<br>Otherwise, press the Cancel button to return.',
      loading: 'Loading transactions ...',
      purchaseSaved: 'The inventory purchases have been successfully saved.',
      noRequests: 'No requests found.',
      noItems: 'No items found.',
      quantity: 'The total quantity of <strong>({{quantity}})</strong> does not match the total quantity in the locations <strong>({{locationQuantity}})</strong>.',
      removeItem: 'Are you sure you want to remove this item from this invoice?',
      removeItemRequest: 'Are you sure you want to remove this item from this request?',
      requestFulfilled: 'The inventory request has been fulfilled.',
      requestUpdated: 'The inventory request has been updated.',
      warning: 'Please fill in required fields (marked with *) and correct the errors before adding.'
    },
    reports: {
      rows: {
        adjustments: 'Adjustments',
        adjustmentsTotal: 'Total Adjustments',
        balanceBegin: 'Beginning Balance',
        balanceEnd: 'Ending Balance',
        category: 'Category',
        consumed: 'Consumed',
        consumedGik: 'GiK Consumed',
        consumedGikTotal: 'Total GiK Consumed',
        consumedPuchases: 'Purchases Consumed',
        consumedPurchasesTotal: 'Total Purchases Consumed',
        consumedTotal: 'Total Consumed',
        errInFinSum: 'Error in _generateFinancialSummaryReport: ',
        errInFindPur: 'Error in _findInventoryItemsByPurchase: ',
        errInFindReq: 'Error in _findInventoryItemsByRequest: ',
        expensesFor: 'Expenses For: ',
        noAccount: '(No Account)',
        subtotal: 'Subtotal: ',
        subtotalFor: 'Subtotal for {{category}} - {{account}}: ',
        total: 'Total: ',
        totalFor: 'Total for {{var}}: ',
        totalPurchases: 'Total Purchases',
        transfer1: '{{quantity}} from {{location}}',
        trasnfer2: 'From: {{source}} To: {{target}}'
      },
      adjustment: 'Detailed Adjustment',
      daysSupply: 'Days Supply Left In Stock',
      expenseDetail: 'Detailed Expenses',
      expenseSum: 'Summary Expenses',
      expiration: 'Expiration Date',
      export: 'Export Report',
      fields: 'Fields to Include',
      finance: 'Finance Summary',
      generate: 'Generate Report',
      invLocation: 'Inventory By Location',
      invValuation: 'Inventory Valuation',
      purchaseDetail: 'Detailed Purchase',
      purchaseSum: 'Summary Purchase',
      reportType: 'Report Type',
      stockTransferDetail: 'Detailed Stock Transfer',
      stockTransferSum: 'Summary Stock Transfer',
      stockUsageDetail: 'Detailed Stock Usage',
      stockUsageSum: 'Summary Stock Usage'
    },
    titles: {
      addPurchase: 'Add Purchase',
      addRequest: 'New Request',
      adjustment: 'Adjustment',
      editPurchase: 'Edit Purchase',
      editRequest: 'Edit Request',
      inventoryItem: 'New Inventory Item',
      inventoryReport: 'Inventory Report',
      purchaseSaved: 'Inventory Purchases Saved',
      quickAddTitle: 'New Inventory Item',
      removeItem: 'Remove Item',
      requestFulfilled: 'Request Fulfilled',
      requestUpdated: 'Request Updated',
      transfer: 'Transfer Items',
      warning: 'Warning!!!!!'
    }
  },
  imaging: {
    pageTitle: 'Imaging Requests',
    sectionTitle: 'Imaging',
    buttons: {
      newButton: '+ new imaging'
    },
    labels: {
      radiologist: 'Radiologist',
      addNewVisit: '--Add New Visit--'
    },
    messages: {
      delete: 'Are you sure you wish to delete this imaging request?',
      noCompleted: 'No completed items found.'
    },
    titles: {
      completedImaging: 'Completed Imaging',
      editTitle: 'Edit Imaging Request',
      newTitle: 'New Imaging Request'
    },
    alerts: {
      completedTitle: 'Imaging Request Completed',
      completedMessage: 'The imaging request has been completed.',
      savedTitle: 'Imaging Request Saved',
      savedMessage: 'The imaging request has been saved.'
    }
  },
  medication: {
    pageTitle: 'Medication Requests',
    sectionTitle: 'Medication',
    returnMedication: 'Return Medication',
    buttons: {
      dispenseMedication: 'dispense medication',
      newButton: '+ new request',
      returnMedication: 'return medication'
    },
    titles: {
      completedMedication: 'Completed Medication',
      editMedicationRequest: 'Edit Medication Request',
      newMedicationRequest: 'New Medication Request'
    },
    messages: {
      createNew: 'Create a new medication request?',
      confirmDeletion: 'Are you sure you wish to delete this medication request?'
    },
    labels: {
      refills: 'Refills',
      quantityRequested: 'Quantity Requested',
      quantityDispensed: 'Quantity Dispensed',
      quantityDistributed: 'Quantity Distributed',
      quantityToReturn: 'Quantity To Return',
      returnLocation: 'Return Location',
      returnAisle: 'Return Aisle',
      returnReason: 'Return Reason/Notes',
      adjustmentDate: 'Adjustment Date',
      creditToAccount: 'Credit To Account'
    },
    alerts: {
      returnedTitle: 'Medication Returned',
      returnedMessage:  'The medication has been marked as returned.',
      savedTitle: 'Medication Request Saved',
      savedMessage: 'The medication record has been saved.',
      fulfilledTitle: 'Medication Request Fulfilled'
    }
  },
  appointments: {
    currentScreenTitle: 'Appointment List',
    editTitle: 'Edit Appointment',
    newTitle: 'New Appointment',
    sectionTitle: 'Appointments',
    thisWeek: 'Appointments This Week',
    missed: 'Missed Appointments',
    searchTitle: 'Search Appointments',
    todayTitle: 'Today\'s Appointments',
    messages: {
      deleteAppointmentMessage: 'Are you sure you wish to delete this appointment?',
      endTimeLaterThanStart: 'Please select an end time later than the start time.'
    },
    buttons: {
      newButton: '+ new appointment'
    },
    labels: {
      selectedStartingDate: 'Show Appointments On Or After'
    }
  },
  vitals: {
    messages: {
      delete: 'Are you sure you wish to delete these vitals?'
    },
    labels: {
      dateRecorded: 'Date Recorded',
      temperature: 'Temperature',
      weight: 'Weight',
      height: 'Height',
      sbp: 'SBP',
      dbp: 'DBP',
      heartRate: 'Heart Rate',
      respiratoryRate: 'Respiratory Rate'
    }
  },
  visits: {
    titles: {
      additionalDiagnoses: 'Additional Diagnoses'
    },
    messages: {
      delete: 'Are you sure you wish to delete this visit?'
    },
    buttons: {
      newProcedure: 'New Procedure',
      newLab: 'New Lab',
      newAppointment: 'New Appointment',
      addDiagnosis: 'Add Diagnosis',
      newImaging: 'New Imaging',
      newMedication: 'New Medication',
      newVitals: 'New Vitals'
    },
    labels: {
      diagnosis: 'Diagnosis',
      procedure: 'Procedure',
      procedureDate: 'Procedure Date',
      authoredBy: 'Authored By',
      labs: 'Labs',
      imaging: 'Imaging',
      visitInformation: 'Visit Information',
      examiner: 'Examiner',
      medication: 'Medication',
      status: 'Visit Status',
      admittingDiagnosis: 'Admitting Diagnosis',
      finalDiagnosis: 'Final/Billing Diagnosis',
      visitDate: 'Visit Date',
      visitType: 'Visit Type',
      vitals: 'Vitals'
    }
  },
  labs: {
    sectionTitle: 'Labs',
    requestsTitle: 'Lab Requests',
    editTitle: 'Edit Lab Request',
    newTitle: 'New Lab Request',
    deleteTitle: 'Delete Request',
    completedTitle: 'Completed Labs',
    labels: {
      labType: 'Lab Type',
      addNewVisit: '--Add New Visit--'
    },
    messages: {
      noItemsFound: 'No labs found.',
      createNewRecord: 'Create a new record?',
      confirmDeletion: 'Are you sure you wish to delete this lab request?',
      noCompleted: 'No completed items found.'
    },
    buttons: {
      newButton: '+ new lab'
    },
    alerts: {
      requestCompletedTitle: 'Lab Request Completed',
      requestCompletedMessage: 'The lab request has been completed.',
      requestSavedTitle: 'Lab Request Saved',
      requestSavedMessage: 'The lab request has been saved.'
    }
  },
  patients: {
    navigation: {
      photos: 'Photos',
      general: 'General',
      history: 'History',
      appointments: 'Appointments',
      visits: 'Visits',
      medication: 'Medication',
      imaging: 'Imaging',
      labs: 'Labs',
      socialWork: 'Social Work'
    },
    titles: {
      admittedPatients: 'Admitted Patients',
      expenses: 'Expenses',
      additionalContacts: 'Additional Contacts',
      familyInformation: 'Family Information',
      delete: 'Delete Patient',
      new: 'New Patient',
      edit: 'Edit Patient',
      patient: 'Patient Report',
      patientListing: 'Patient Listing',
      patientReport: 'Patient Report',
      addPhoto: 'Add Photo',
      editPhoto: 'Edit Photo',
      socialWork: 'Expense',
      familyInfo: 'Family Info',
      deleteFamilyMember: 'Delete Family Member',
      deleteExpense: 'Delete Expense',
      deletePhoto: 'Delete Photo',
      deleteContact: 'Delete Contact',
      savedPatient: 'Patient Saved',
      admissionsDetail: 'Admissions Detail',
      admissionsSummary: 'Admissions Summary',
      diagnosticTesting: 'Diagnostic Testing',
      dischargesDetail: 'Discharges Detail',
      dischargesSummary: 'Discharges Summary',
      proceduresDetail: 'Procedures Detail',
      proceduresSummary: 'Procedures Summary',
      patientStatus: 'Patient Status',
      totalPatientDays: 'Total Patient Days',
      totalPatientDaysDetailed: 'Total Patient Days (Detailed)',
      visit: 'Visit',
      deletePatientRecord: 'Delete Patient Record'
    },
    messages: {
      areYouSureDelete: 'Are you sure you want to delete this {{object}}?',
      deletePatient: 'Are you sure you wish to delete {{firstName}} {{lastName}}?',
      noPatientsFound: 'No patients found.',
      savedPatient: 'The patient record for {{displayName}} has been saved.',
      notFoundQuickAdd: 'The patient <strong>{{patientFullName}}</strong> could not be found.  If you would like to create a new patient, fill in the information below.  Otherwise press the Cancel button to return.',
      createNewPatient: 'Create a new patient record?',
      deletingPatient: 'Deleting patient and all associated records'
    },
    buttons: {
      addExpense: 'Add Expense',
      addContact: 'Add Contact',
      newLab: 'New Lab',
      newVisit: 'New Visit',
      newMedication: 'New Medication',
      newImaging: 'New Imaging',
      addFamilyMember: 'Add Family Member',
      newPhoto: 'New Photo',
      newAppointment: 'New Appointment',
      backToPatients: 'Back to Patient List',
      newPatient: '+ new patient'
    },
    headings: {
      history: 'History',
      historySince: 'History Since'
    },
    labels: {
      primaryDiagnosis: 'Primary Diagnoses',
      secondaryDiagnosis: 'Secondary Diagnoses',
      monthlyCost: 'Monthly Cost',
      totalMontlyExpense: 'Total Monthly Expenses',
      patientType: 'Patient Type',
      admissionDate: 'Admission Date',
      patientDays: 'Patient Days',
      dischargeDate: 'Discharge Date',
      discharge: 'Discharge',
      admit: 'Admit',
      relationships: 'Relationships',
      phone: 'Phone',
      email: 'Email',
      firstName: 'First Name',
      middleName: 'Middle Name',
      lastName: 'Last Name',
      sex: 'Sex',
      dob: 'DOB',
      dateOfBirth: 'Date Of Birth',
      placeOfBirth: 'Place Of Birth',
      sources: 'Sources',
      costs: 'Costs',
      civilStatus: 'Civil Status',
      relationship: 'Relationship To Patient',
      education: 'Education',
      occupation: 'Occupation',
      income: 'Income',
      insurance: 'Insurance',
      dateProcessed: 'Date Processed',
      status: 'Patient Status',
      externalPatientId: 'External Patient Id',
      bloodType: 'Blood Type',
      clinic: 'Clinic Site',
      referredBy: 'Referred By',
      referredDate: 'Referred Date',
      religion: 'Religion',
      parent: 'Parent/Guardian',
      contacts: 'Contacts',
      sexNotEntered: 'Sex Not Entered'
    },
    notes: {
      newNote: 'New Note for',
      updateNote: 'Updating Note from',
      onBehalfOfLabel: 'On Behalf Of',
      onBehalfOfCopy: 'on behalf of',
      pleaseSelectAVisit: 'Please select a visit'
    }
  },
  billing: {
    alerts: {
      noInvoiceFound: 'No invoices found',
      deleteItem: 'Are you sure you wish to delete {{item}}?',
      noPricingItems: 'No pricing items found.',
      noPricingProfiles: 'No pricing profiles found.'
    },
    buttons: {
      createInvoice: 'Create an invoice?',
      addOverride: 'Add Override'
    },
    labels: {
      externalInvoiceNumber: 'External Invoice #',
      paymentProfile: 'Payment Profile',
      actualCharges: 'Actual Charges',
      insurance: 'National Insurance',
      hmoCom: 'HMO/COM',
      paymentsDeposits: 'Payments/Deposits',
      pricingPanelOverrides: 'Pricing profile overrides',
      pricingProfile: 'Pricing Profile',
      discountAmount: 'Discount Amount',
      discountPercentage: 'Discount Percentage'
    }
  },
  print: {
    invoice: {
      labels: {
        patientName: 'NAME OF PATIENT:',
        patientId: 'PATIENT #:',
        patientAge: 'AGE:',
        patientAddress: 'ADDRESS:',
        dateAdmitted: 'ADMITTED:',
        dateDischarged: 'DISCHARGE:',
        dischargeNotes: 'Discharge Notes:',
        remarks: 'Remarks:',
        billedBy: 'Billed by:',
        billedDate: 'Bill Date:',
        spacer: '__________________________________________'
      },
      messages: {
        whereConducted: 'were deducted during my confinement'
      },
      titles: {
        patientMember: 'Patient-Member',
        relContact: 'Relationship/Contact no.',
        patients: 'PATIENT\'S',
        billingStatement: 'BILLING STATEMENT'
      }
    }
  },
  procedures: {
    titles: {
      addChargeItem: 'Add Charge Item',
      deleteChargeItem: 'Delete Charge Item',
      editChargeItem: 'Edit Charge Item',
      medicationUsed: 'Medication Used',
      deleteMedicationUsed: 'Delete Medication Used',
      addMedicationUsed: 'Add Medication Used',
      editMedicationUsed: 'Edit Medication Used',
      edit: 'Edit Procedure',
      saved: 'Procedure Saved',
      new: 'New Procedure'
    },
    labels: {
      medicationUsed: 'Medication Used'
    },
    messages: {
      deleteMedication: 'Are you sure you want to delete this medication?',
      delete: 'Are you sure you wish to delete this procedure?',
      saved: 'The procedure record has been saved.'
    },
    buttons: {
      addMedication: 'Add Medication'
    }
  },
  components: {
    chargesByTypeTab: {
      charges: 'charges'
    },
    takePhoto: {
      how: 'How Do You Want To Add A Photo?',
      takePhoto: 'Take photo',
      uploadPhoto: 'Upload Photo',
      uploadFile: 'Upload File',
      camera: 'Camera',
      photo: 'photo',
      preview: 'preview'
    },
    quantityConv: {
      unit: 'Unit',
      conversion: 'What does 1 {{name}} contain?'
    },
    quantityCalc: {
      result: '{{targetUnit}} total: {{calculated}}'
    },
    priceList: {
      charges: '{{pricingType}} charges'
    }
  }
};
