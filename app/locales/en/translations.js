export default {
  dashboard: {
    title: 'What would you like to do?'
  },
  errors: {
    inclusion: 'is not included in the list',
    exclusion: 'is reserved',
    invalid: 'is invalid',
    confirmation: 'doesn\'t match {{attribute}}',
    accepted: 'must be accepted',
    empty: 'can\'t be empty',
    blank: 'can\'t be blank',
    present: 'must be blank',
    tooLong: 'is too long (maximum is {{count}} characters)',
    tooShort: 'is too short (minimum is {{count}} characters)',
    wrongLength: 'is the wrong length (should be {{count}} characters)',
    notANumber: 'is not a number',
    notAnInteger: 'must be an integer',
    greaterThan: 'must be greater than {{count}}',
    greaterThanOrEqualTo: 'must be greater than or equal to {{count}}',
    equalTo: 'must be equal to {{count}}',
    lessThan: 'must be less than {{count}}',
    lessThanOrEqualTo: 'must be less than or equal to {{count}}',
    otherThan: 'must be other than {{count}}',
    odd: 'must be odd',
    even: 'must be even',
    invalidNumber: 'not a valid number',
    result: 'Please enter a result before completing'
  },
  dates: {
    long: '{{years}} year {{months}} months {{days}} days',
    longPlural: '{{years}} years {{months}} months {{days}} days',
    longOmitYears: '{{months}} months {{days}} days',
    longOmitDays: '{{years}} year {{months}} months',
    longOmitDaysPlural: '{{years}} years {{months}} months',
    longOmitDaysYears: '{{months}} months',
    shortOmitYears: '{{months}}m {{days}}d',
    short: '{{years}}y {{months}}m {{days}}d'
  },
  navigation: {
    imaging: 'Imaging',
    inventory: 'Inventory',
    patients: 'Patients',
    scheduling: 'Scheduling',
    medication: 'Medication',
    labs: 'Labs',
    billing: 'Billing',
    administration: 'Administration',
    incident: 'Incident',
    subnav: {
      actions: 'Actions',
      requests: 'Requests',
      items: 'Items',
      completed: 'Completed',
      newRequest: 'New Request',
      inventoryReceived: 'Inventory Received',
      reports: 'Reports',
      patientListing: 'Patient Listing',
      newPatient: 'New Patient',
      appointmentsThisWeek: 'Appointments This Week',
      "today'sAppointments": 'Today\'s Appointments',
      appointmentSearch: 'Appointment Search',
      addAppointment: 'Add Appointment',
      dispense: 'Dispense',
      returnMedication: 'Return Medication',
      invoices: 'Invoices',
      newInvoice: 'New Invoice',
      prices: 'Prices',
      priceProfiles: 'Price Profiles',
      lookupLists: 'Lookup Lists',
      addressFields: 'Address Fields',
      loadDB: 'Load DB',
      users: 'Users',
      newUser: 'New User',
      admittedPatients: 'Admitted Patients',
      missedAppointments: 'Missed Appointments',
      userRoles: 'User Roles',
      workflow: 'Workflow',
      outpatient: 'Outpatient',
      customForms: 'Custom Forms',
      appointmentsCalendar: 'Appointments Calendar',
      theaterSchedule: 'Theater Schedule',
      scheduleSurgery: 'Schedule Surgery',
      printHeader: 'Print Header',
      currentIncidents: 'Current Incidents',
      newIncident: 'New Incident',
      history: 'History',
      incidentCategories: 'Incident Categories'
    },
    actions: {
      logout: 'Logout',
      login: 'Login'
    },
    about: 'About HospitalRun'
  },
  user: {
    plusNewUser: '+ new user',
    usersPageTile: 'User Listing'
  },
  admin: {
    addressOptions: 'Address Options',
    lookupLists: 'Lookup Lists',
    loadDb: 'Load DB',
    userRoles: 'User Roles',
    users: 'Users',
    address: {
      address1Label: 'Address 1 Label',
      address2Label: 'Address 2 Label',
      address3Label: 'Address 3 Label',
      address4Label: 'Address 4 Label',
      include1Label: 'Include 1 Label',
      include2Label: 'Include 2 Label',
      include3Label: 'Include 3 Label',
      include4Label: 'Include 4 Label',
      titles: {
        optionsSaved: 'Options Saved'
      },
      messages: {
        addressSaved: 'The address options have been saved'
      },
      newTitle: 'Address Options',
      editTitle: 'Address Options',
      addressLabel: 'Address'
    },
    header: {
      facilityName: 'Facility Name',
      headerLine1: 'Header Line 1',
      headerLine2: 'Header Line 2',
      headerLine3: 'Header Line 3',
      logoURL: 'Logo URL',
      includeFacilityName: 'Include Facility Name',
      includeHeaderLine1: 'Include Header Line 1',
      includeHeaderLine2: 'Include Header Line 2',
      includeHeaderLine3: 'Include Header Line 3',
      includeLogoURL: 'Include Logo URL',
      titles: {
        optionsSaved: 'Options Saved'
      },
      messages: {
        headerSaved: 'The header options have been saved'
      },
      newTitle: 'Header Options',
      editTitle: 'Header Options',
      headerLabel: 'Header'
    },
    customForms: {
      buttons: {
        addField: 'Add Field',
        moveDown: 'Move Down',
        moveUp: 'Move Up',
        newForm: '+ new form',
        preview: 'Preview'

      },
      labels: {
        alwaysInclude: 'Always Include',
        checkbox: 'Checkbox',
        columns: 'Columns',
        colSpan: 'Number of Columns To Span',
        customForm: 'Custom Form',
        formName: 'Form Name',
        formType: 'Form Type',
        includeOtherOption: 'Include Other Option',
        incidentFormType: 'Incident',
        label: 'Label',
        newForm: 'New Form',
        operativePlanFormType: 'Operative Plan and Report',
        otherOptionLabel: 'Other Option Label',
        patientFormType: 'Patient',
        property: 'Property',
        radio: 'Radio',
        select: 'Dropdown',
        socialworkFormType: 'Social Work',
        text: 'Text',
        textarea: 'Large Text',
        visitFormType: 'Visit',
        opdReportFormType: 'Outpatient Report',
        dischargeReportFormType: 'Discharge Report',
        labFormType: 'Lab'
      },
      messages: {
        formSaved: 'The {{name}} form has been saved.'
      },
      titles: {
        customForms: 'Custom Forms',
        deleteForm: 'Delete Custom Form',
        editCustomForm: 'Edit Custom Form',
        fields: 'Fields',
        formSaved: 'Form Saved',
        checkboxValues: 'Checkbox Values',
        dropDownValues: 'Dropdown Values',
        newCustomForm: 'New Custom Form',
        radioValues: 'Radio Values'
      }
    },
    loaddb: {
      progressMessage: 'Please wait while your database is loaded.',
      progressTitle: 'Loading Database',
      displayAlertTitle: 'Select File To Load',
      displayAlertMessage: 'Please select file to load.',
      errorDisplayAlertTitle: 'Error Loading',
      errorDisplayAlertMessage: 'The database could not be imported. The error was: {{error}}',
      editTitle: 'Load DB'
    },
    lookup: {
      alertImportListTitle: 'Select File To Import',
      alertImportListMessage: 'Please select file to import.',
      alertImportListSaveTitle: 'List Imported',
      alertImportListSaveMessage: 'The lookup list has been imported.',
      alertImportListUpdateTitle: 'List Saved',
      alertImportListUpdateMessage: 'The lookup list has been saved.',
      pageTitle: 'Lookup Lists',
      edit: {
        template: {
          addTitle: 'Add Value',
          editTitle: 'Edit Value',
          updateButtonTextAdd: 'Add',
          updateButtonTextUpdate: 'Update',
          labelTitle: 'Value'
        }
      },
      anesthesiaTypes: 'Anesthesia Types',
      anesthesiologists: 'Anesthesiologists',
      billingCategories: 'Billing Categories',
      clinicList: 'Clinic Locations',
      countryList: 'Countries',
      diagnosisList: 'Diagnoses',
      cptCodeList: 'CPT Codes',
      expenseAccountList: 'Expense Accounts',
      aisleLocationList: 'Inventory Aisle Locations',
      warehouseList: 'Inventory Locations',
      incidentDepartments: 'Incident Departments',
      inventoryTypes: 'Inventory Types',
      imagingPricingTypes: 'Imaging Pricing Types',
      labPricingTypes: 'Lab Pricing Types',
      patientStatusList: 'Patient Status List',
      physicianList: 'Physicians',
      procedureList: 'Procedures',
      procedureLocations: 'Procedures Locations',
      procedurePricingTypes: 'Procedure Pricing Types',
      radiologists: 'Radiologists',
      unitTypes: 'Unit Types',
      vendorList: 'Vendor',
      visitLocationList: 'Visit Locations',
      visitTypes: 'Visit Types',
      wardPricingTypes: 'Ward Pricing Types',
      titles: {
        deleteLookupValue: 'Delete Value'
      }
    },
    roles: {
      capability: {
        admin: 'Administration',
        loadDb: 'Load Database',
        updateConfig: 'Update Configurations',
        appointments: 'Appointments',
        addAppointment: 'Add Appointment',
        billing: 'Billing',
        addCharge: 'Add Charge',
        addPricing: 'Add Pricing',
        addPricingProfile: 'Add Pricing Profile',
        addInvoice: 'Add Invoice',
        addPayment: 'Add Payment',
        deleteInvoice: 'Delete Invoice',
        deletePricing: 'Delete Pricing',
        deletePricingProfile: 'Delete Pricing Profile',
        editInvoice: 'Edit Invoice',
        invoices: 'Invoices',
        overrideInvoice: 'Override Invoice',
        pricing: 'Pricing',
        patients: 'Patients',
        addDiagnosis: 'Add Diagnosis',
        addPhoto: 'Add Photo',
        addPatient: 'Add Patient',
        addProcedure: 'Add Procedure',
        addVisit: 'Add Visit',
        addVitals: 'Add Vitals',
        admitPatient: 'Admit Patient',
        deletePhoto: 'Delete Photo',
        deletePatient: 'Delete Patient',
        deleteAppointment: 'Delete Appointment',
        deleteDiagnosis: 'Delete Diagnosis',
        deleteProcedure: 'Delete Procedure',
        deleteSocialwork: 'Delete Social Work',
        deleteVitals: 'Delete Vitals',
        deleteVisit: 'Delete Visit',
        dischargePatient: 'Discharge Patient',
        patientReports: 'Patient Reports',
        visits: 'Visits',
        medication: 'Medication',
        addMedication: 'Add Medication',
        deleteMedication: 'Delete Medication',
        fulfillMedication: 'Fulfill Medication',
        labs: 'Labs',
        addLab: 'Add Lab',
        completeLab: 'Complete Lab',
        deleteLab: 'Delete Lab',
        imaging: 'Imaging',
        addImaging: 'Add Imaging',
        completeImaging: 'Complete Imaging',
        deleteImaging: 'Delete Imaging',
        inventory: 'Inventory',
        addInventoryRequest: 'Add Inventory Request',
        addInventoryItem: 'Add Inventory Item',
        addInventoryPurchase: 'Add Inventory Purchase',
        adjustInventoryLocation: 'Adjust Inventory Location',
        deleteInventoryItem: 'Delete Inventory Item',
        fulfillInventory: 'Fulfill Inventory',
        defineUserRoles: 'Define User Roles',
        addBillingDiagnosis: 'Add Billing Diagnosis',
        addNote: 'Add Note',
        addSocialwork: 'Add Social Work',
        deleteNote: 'Delete Note',
        addOperativePlan: 'Add Operative Plan',
        addAllergy: 'Add Allergy',
        addOperationReport: 'Add Operation Report',
        incident: 'Incident',
        addIncident: 'Add Incident',
        addIncidentCategory: 'Add Incident Category',
        deleteIncident: 'Delete Incident',
        deleteIncidentCategory: 'Delete Incident Category',
        generateIncidentReport: 'Generate Incident Report',
        manageIncidents: 'Manage Incidents'
      },
      messages: {
        roleSaved: 'The {{roleName}} role has been saved.'
      },
      titles: {
        roleSaved: 'Role Saved'
      }
    },
    visitForms: {
      labels: {
        followup: 'Followup',
        form: 'Form',
        initial: 'Initial',
        visitType: 'Visit Type'
      },
      titles: {
        visitForms: 'Visit Forms'
      }
    },
    workflow: {
      admissionDepositLabel: 'Admission deposit required',
      clinicPrepaymentLabel: 'Clinic prepayment required',
      followupPrepaymentLabel: 'Followup prepayment required',
      outpatientLabLabel: 'Outpatient Lab prepayment required',
      outpatientImagingLabel: 'Outpatient Imaging prepayment required',
      outpatientMedicationLabel: 'Outpatient Medication prepayment required',

      titles: {
        optionsSaved: 'Options Saved'
      },
      messages: {
        optionsSaved: 'The workflow options have been saved'
      },

      newTitle: 'Workflow Options',
      editTitle: 'Workflow Options',
      workflowLabel: 'Workflow'

    }
  },
  labels: {
    cptcode: 'CPT Code',
    loading: 'Loading',
    name: 'Name',
    note: 'Note',
    patient: 'Patient',
    prescriber: 'Prescriber',
    quantity: 'Quantity',
    requestedOn: 'Requested On',
    date: 'Date',
    dateOfBirth: 'Date of Birth',
    dateOfBirthShort: 'DoB',
    dateRequested: 'Date Requested',
    dateCompleted: 'Date Completed',
    description: 'Description',
    requestedBy: 'Requested By',
    fulfill: 'Fulfill',
    fulfillRequest: 'Fulfill Request',
    fulfillRequestNow: 'Fulfill Request Now',
    actions: 'Actions',
    action: 'Action',
    notes: 'Notes',
    edit: 'Edit',
    view: 'View',
    print: 'Print',
    imageOrders: 'Image Orders',
    labOrders: 'Lab Orders',
    imagingType: 'Imaging Type',
    result: 'Result',
    results: 'Results',
    visit: 'Visit',
    requests: 'Requests',
    completed: 'Completed',
    id: 'Id',
    on: 'on',
    type: 'Type',
    sex: 'Sex',
    age: 'Age',
    search: 'Search',
    username: 'Username',
    email: 'Email',
    role: 'Role',
    delete: 'Delete',
    userCanAddNewValue: 'User Can Add New Values',
    value: 'Value',
    lookupType: 'Lookup Type',
    importFile: 'Import File',
    fileLoadSuccessful: 'File To Load Successful',
    fileToLoad: 'File Load',
    fileName: 'File Name',
    startTime: 'Start Time',
    startDate: 'Start Date',
    endTime: 'End Time',
    endDate: 'End Date',
    docRead: 'Docs Read',
    docWritten: 'Docs Written',
    displayName: 'Display Name',
    password: 'Password',
    editUser: 'Edit User',
    newUser: 'New User',
    deleteUser: 'Delete User',
    medication: 'Medication',
    status: 'Status',
    addNewOutpatientVisit: '--Add New Outpatient Visit--',
    prescription: 'Prescription',
    prescriptionDate: 'Prescription Date',
    billTo: 'Bill To',
    pullFrom: 'Pull From',
    fulfilled: 'Fulfilled',
    deleteRequest: 'Delete Request',
    location: 'Location',
    provider: 'Provider',
    with: 'With',
    allDay: 'All Day',
    physician: 'Physician',
    assisting: 'Assisting',
    anesthesia: 'Anesthesia',
    procedures: 'Procedures',
    number: 'Number',
    billDate: 'Bill Date',
    balanceDue: 'Balance Due',
    amount: 'Amount',
    datePaid: 'Date Paid',
    creditTo: 'Credit To',
    invoiceId: 'Invoice ID',
    lineItems: 'Line Items',
    discount: 'Discount',
    excess: 'Excess',
    price: 'Price',
    total: 'Total',
    expenseTo: 'Expense To',
    grandTotal: 'Grand Total',
    remarks: 'Remarks',
    payments: 'Payments',
    category: 'Category',
    department: 'Department',
    address: 'Address',
    country: 'Country'
  },
  messages: {
    noItemsFound: 'No items found.',
    noHistoryAvailable: 'No history available.',
    createNewRecord: 'Create a new record?',
    createNewUser: 'Create a new user?',
    noUsersFound: 'No users found.',
    userHasBeenSaved: 'The user has been saved.',
    userSaved: 'User Saved',
    onBehalfOf: 'on behalf of',
    newPatientHasToBeCreated: 'A new patient needs to be created...Please wait..',
    noNotesAvailable: 'No additional clinical notes are available for this visit.',
    sorry: 'Sorry, something went wrong...',
    forAuthorizedPersons: 'This report is for authorized persons only.',
    requiredFieldsCorrectErrors: 'Please fill in required fields (marked with *) and correct the errors before saving.',
    saveActionException: 'An error occurred while attempting to save: {{message}}',
    reportError: 'An error was encountered while generating the requested report.  Please let your system administrator know that you have encountered an error.',
    delete: 'Are you sure you wish to delete {{name}}?',
    delete_singular: 'Are you sure you wish to delete this {{name}}?',
    delete_plural: 'Are you sure you wish to delete these {{name}}?'
  },
  alerts: {
    pleaseWait: 'Please Wait',
    warningExclamation: 'Warning!!!!',
    errorExclamation: 'Error!!!!',
    reportError: 'Error Generating Report'
  },
  headings: {
    chargedItems: 'Charged Items'
  },
  buttons: {
    addItem: 'Add Item',
    complete: 'Complete',
    cancel: 'Cancel',
    close: 'Close',
    returnButton: 'Return',
    barcode: 'Barcode',
    add: 'Add',
    update: 'Update',
    ok: 'Ok',
    fulfill: 'Fulfill',
    remove: 'Remove',
    delete: 'Delete',
    newUser: 'New User',
    addValue: 'Add Value',
    newNote: 'New Note',
    import: 'Import',
    loadFile: 'Load File',
    newRequest: 'New Request',
    allRequests: 'All Requests',
    dispense: 'Dispense',
    newItem: '+ new item',
    newRequestPlus: '+ new request',
    addVisit: 'Add Visit',
    search: 'Search',
    filter: 'Filter',
    clear: 'Clear',
    edit: 'Edit',
    addLineItem: 'Add Line Item',
    showFewer: 'Show Fewer',
    showAll: 'Show All'
  },
  login: {
    messages: {
      signIn: 'please sign in',
      error: 'Username or password is incorrect.'
    },
    labels: {
      password: 'Password',
      username: 'Username',
      signIn: 'Sign in'
    }
  },
  loading: {
    progressBar: {
      progress: '{{progressBarValue}}% Complete'
    },
    messages: {
      0: 'The top butterfly flight speed is 12 miles per hour. Some moths can fly 25 miles per hour!',
      1: 'Owls are the only birds that can see the color blue.',
      2: 'Cats have over 100 vocal sounds; dogs only have 10.',
      3: 'Humans use a total of 72 different muscles in speech.',
      4: 'More than 1,000 different languages are spoken on the continent of Africa.',
      5: 'An erythrophobe is someone who blushes easily.',
      6: 'The most common phobia in the world is odynophobia which is the fear of pain.',
      7: 'Your body uses 300 muscles to balance itself when you are standing still.',
      8: 'Certain frogs can be frozen solid then thawed, and continue living.',
      9: 'Our eyes are always the same size from birth, but our nose and ears never stop growing.',
      10: 'Your tongue is the only muscle in your body that is attached at only one end.',
      11: 'Camels have three eyelids to protect themselves from blowing sand.'
    }
  },
  inventory: {
    edit: {
      cost: 'Cost Per Unit:',
      delivered: 'Delievered To:',
      location: 'Location Adjusted:',
      prescription: 'Prescription For:',
      pulled: 'Pulled From:',
      quantity: 'Quantity at Completion:',
      reason: 'Reason:',
      returned: 'Returned from Patient:',
      transferredFrom: 'Transferred From:',
      transferredTo: 'Transferred To:'
    },
    labels: {
      action: 'Action',
      add: 'Add',
      adjust: 'Adjust',
      adjustmentDate: 'Adjustment Date',
      adjustmentFor: 'Adjustment For',
      adjustmentType: 'Adjustment Type',
      aisle: 'Aisle',
      aisleLocation: 'Aisle Location',
      allInventory: 'All Inventory',
      availableQuantity: '{{quantity}} available',
      billTo: 'Bill To',
      consumePurchases: 'Consume Purchases',
      consumptionRate: 'Consumption Rate',
      cost: 'Cost',
      costPerUnit: 'Cost per Unit',
      crossReference: 'Cross Reference',
      currentQuantity: 'Current Quantity',
      dateCompleted: 'Date Completed',
      dateEffective: 'Effective Date',
      dateEnd: 'End Date',
      dateStart: 'Start Date',
      dateReceived: 'Date Received',
      dateTransferred: 'Date Transferred',
      daysLeft: 'Days Left',
      deliveryAisle: 'Delivery Aisle',
      deliveryLocation: 'Delivery Location',
      distributionUnit: 'Distribution Unit',
      deleteItem: 'Delete Item',
      details: 'Details',
      editItem: 'Edit Item',
      expense: 'Expense To',
      expirationDate: 'Expiration Date',
      fulfillRequest: 'Fulfill Request',
      fulfillRequestNow: 'Fulfill Request Now',
      gift: 'Gift in Kind',
      giftUsage: 'Gift in Kind Usage',
      giftInKindNo: 'N',
      giftInKindYes: 'Y',
      inventoryConsumed: 'Inventory Consumed',
      inventoryItem: 'Inventory Item',
      inventoryObsolence: 'Inventory Obsolence',
      invoiceItems: 'Invoice Items',
      invoiceLineItem: 'Invoice Line Item',
      invoiceNumber: 'Invoice Number',
      item: 'Item',
      items: 'Items',
      itemNumber: 'Item Number',
      location: 'Location',
      locations: 'Locations',
      name: 'Name',
      markAsConsumed: 'Mark as Consumed',
      newItem: 'New Item',
      allItems: 'All Items',
      originalQuantity: 'Original Quantity',
      print: 'Print',
      printBarcode: 'Print Barcode',
      printer: 'Printer',
      pullFrom: 'Pull From',
      purchases: 'Purchases',
      purchaseCost: 'Purchase Cost',
      purchaseInfo: 'Purchase Information',
      quantity: 'Quantity ({{unit}})',
      quantityAvailable: 'Quantity Available',
      quantityOnHand: 'Quantity on Hand',
      quantityRequested: 'Quantity Requested',
      rank: 'Rank',
      reason: 'Reason',
      remove: 'Remove',
      reorderPoint: 'Reorder Point',
      requestedItems: 'Requested Items',
      salePricePerUnit: 'Sale Price per Unit',
      save: 'Save',
      serialNumber: 'Serial/Lot Number',
      total: 'Total',
      totalCost: 'Total Cost',
      totalReceived: 'Total Received: {{total}}',
      transaction: 'Transaction',
      transactions: 'Transactions',
      transfer: 'Transfer',
      transferFrom: 'Transfer From',
      transferTo: 'Transfer To Location',
      transferToAisle: 'Transfer to Aisle Location',
      unit: 'Unit',
      unitCost: 'Unit Cost',
      vendor: 'Vendor',
      vendorItemNumber: 'Vendor Item Number',
      xref: 'XRef'
    },
    messages: {
      adjust: 'Please adjust the quantities on the appropriate location(s) to account for the difference of {{difference}}.',
      createRequest: 'Create a new request?',
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
      stockUsageSum: 'Summary Stock Usage',
      titleSingleDate: '{{name}} Report {{date}}',
      titleDateRange: '{{name}} Report {{startDate}} - {{endDate}}'
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
  incident: {
    buttons: {
      add: 'Add',
      addForm: '+ Add Form',
      addItem: 'Add Item',
      cancel: 'Cancel',
      delete: 'Delete',
      download: 'Download',
      edit: 'Edit',
      export: 'Export Report',
      generateRep: 'Generate Report',
      newAttachment: '+ New Attachment',
      newCategory: '+ new category',
      newIncident: '+ new incident',
      newNote: '+ New Note'
    },
    labels: {
      actions: 'Actions',
      addedBy: 'Added By',
      category: 'Category',
      categoryItem: 'Category Item',
      date: 'Date',
      dateRecorded: 'Date Recorded',
      department: 'Department',
      description: 'Incident Description',
      endDate: 'End Date',
      givenBy: 'Given By',
      howToAddAttachment: 'How Do You Want To Add An Attachment?',
      incidentDate: 'Date of Incident',
      incidentId: 'Incident ID',
      item: 'Item',
      lastUpdated: 'Last Updated',
      note: 'Note',
      patientId: 'Patient Id',
      patientImpacted: 'Patient Impacted',
      reportType: 'Report Type',
      reportedBy: 'Reported By',
      reportedDate: 'Reported Date',
      reportedTo: 'Incident Reported to (Full Name)',
      sentinelEvent: 'Sentinel Event',
      startDate: 'Start Date',
      status: 'Status',
      statusActive: 'Active',
      statusClosed: 'Closed',
      statusFollowup: 'Follow-up',
      statusReported: 'Reported',
      title: 'Title',
      total: 'Total',
      updatedBy: 'Updated By'
    },
    messages: {
      attachmentFileRequired: 'Please upload a file or take a picture or before saving this attachment.',
      createNew: 'Create a new incident?',
      createNewIncidentCategory: 'Create a new Incident Category?',
      fillIn: 'Fill in the above options to calculate score',
      incidentCategorySaved: 'The {{name}} category has been saved.',
      noClosedIncidents: 'No closed incidents found.',
      noIncidentCategoriesFound: 'No Incident Categories found.',
      noIncidents: 'No incidents found.',
      saved: 'The incident report has been saved.',
      selectExistingPatient: 'Please select an existing patient or leave this field blank.'
    },
    titles: {
      addAttachment: 'Add Attachment',
      addCategoryItem: 'Add Category Item',
      addNote: 'Add Note',
      attachments: 'Attachments',
      closed: 'Closed Incidents',
      current: 'Current',
      deleteAttachment: 'Delete Attachment',
      deleteIncident: 'Delete Incident',
      deleteIncidentCategory: 'Delete Incident Category',
      deleteItem: 'Delete Item',
      deleteNote: 'Delete Note',
      editAttachment: 'Edit Attachment',
      editIncident: 'Edit Incident',
      editIncidentCategory: 'Edit Incident Category',
      editNote: 'Edit Note',
      general: 'General Information',
      history: 'History',
      incidentCategories: 'Incident Categories',
      incidentCategoryItem: 'Incident Category Item',
      incidentCategoryName: 'Incident Category Name',
      incidentCategorySaved: 'Incident Category Saved',
      incidentSaved: 'Incident Saved',
      incidents: 'Incidents',
      incidentsByCategory: 'Incidents By Category',
      incidentsByDepartment: 'Incidents By Department',
      newIncident: 'New Incident',
      newIncidentCategory: 'New Incident Category',
      notes: 'Notes',
      reports: 'Reports'
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
      createNew: 'Create a new medication request?'
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
      returnedMessage: 'The medication has been marked as returned.',
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
    calendarTitle: 'Appointments Calendar',
    messages: {
      appointmentSaved: 'The appointment for {{patient}} has been saved.',
      endTimeLaterThanStart: 'Please select an end time later than the start time.'
    },
    buttons: {
      newButton: '+ new appointment',
      scheduleSurgery: '+ schedule surgery'
    },
    labels: {
      noLocation: 'No Location',
      selectedStartingDate: 'Show Appointments On Or After'
    },
    titles: {
      appointmentSaved: 'Appointment Saved',
      editSurgicalAppointment: 'Edit Surgical Appointment',
      newSurgicalAppointment: 'New Surgical Appointment',
      theaterSchedule: 'Theater Schedule'
    }
  },
  vitals: {
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
      additionalDiagnoses: 'Additional Diagnoses',
      checkedIn: 'Patient Checked In',
      checkOut: 'Patient Check Out',
      checkedOut: 'Patient Checked Out',
      discharged: 'Patient Discharged',
      editVisit: 'Edit Visit',
      newVisit: 'New Visit',
      patientCheckIn: 'Patient Check In',
      visitSaved: 'Visit Saved'
    },
    messages: {
      checkOut: 'Are you sure you wish to check out {{patientName}}?',
      checkedOut: '{{patientName}} has been checked out.',
      discharged: '{{patientName}} has been discharged.',
      patientCheckedIn: '{{patientName}} has been checked in.',
      patientCreatedAndCheckedIn: '{{patientName}} has been created and checked in.',
      visitAndPatientSaved: 'The visit and patient records have been saved.',
      visitSaved: 'The visit record has been saved.'
    },
    buttons: {
      newProcedure: 'New Procedure',
      newAppointment: 'New Appointment',
      addDiagnosis: 'Add Diagnosis',
      newVitals: 'New Vitals',
      checkIn: 'Check In',
      checkOut: 'Check Out',
      discharge: 'Discharge',
      newOPDReport: 'New OPD Report',
      newDischargeReport: 'New Discharge Report'
    },
    labels: {
      diagnosis: 'Diagnosis',
      procedure: 'Procedure',
      procedureDate: 'Procedure Date',
      authoredBy: 'Authored By',
      visitInformation: 'Visit Information',
      examiner: 'Examiner',
      status: 'Visit Status',
      finalDiagnosis: 'Final/Billing Diagnosis',
      visitDate: 'Visit Date',
      visitType: 'Visit Type',
      patientToCheckIn: 'Patient To Check In',
      checkInTime: 'Check In',
      checkOutTime: 'Check Out',
      appointment: 'Appointment',
      haveAppointment: 'Y',
      noAppointment: 'N',
      ordersDone: 'Orders Done',
      haveDoneOrders: 'Y',
      ordersNotDone: 'N',
      reasonForVisit: 'Reason For Visit',
      statusAdmitted: 'Admitted',
      statusDischarged: 'Discharged',
      statusCheckedIn: 'Checked In',
      statusCheckedOut: 'Checked Out',
      createNewPatient: 'Create New Patient',
      reportType: 'Report type'
    },
    navigation: {
      charges: 'Charges',
      notes: 'Notes',
      orders: 'Orders',
      procedures: 'Procedures',
      vitals: 'Vitals',
      reports: 'Reports'
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
      addContact: 'Add Contact',
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
      todaysOutpatients: 'Today\'s Outpatients',
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
      deletePatientRecord: 'Delete Patient Record',
      outpatientsForDate: 'Outpatients for {{visitDate}}'
    },
    messages: {
      areYouSureDelete: 'Are you sure you want to delete this {{object}}?',
      noPatientsFound: 'No patients found.',
      savedPatient: 'The patient record for {{displayName}} has been saved.',
      notFoundQuickAdd: 'The patient <strong>{{patientFullName}}</strong> could not be found.  If you would like to create a new patient, fill in the information below.  Otherwise press the Cancel button to return.',
      createNewPatient: 'Create a new patient record?',
      deletingPatient: 'Deleting patient and all associated records',
      photoFileRequired: 'Please take a picture or upload a file before saving this photo.'
    },
    buttons: {
      addExpense: 'Add Expense',
      addContact: 'Add Contact',
      addOperativePlan: 'Add Operative Plan',
      editOperativePlan: 'Current Operative Plan',
      download: 'Download',
      newLab: 'New Lab',
      newVisit: 'New Visit',
      newMedication: 'New Medication',
      newImaging: 'New Imaging',
      addFamilyMember: 'Add Family Member',
      newPhoto: 'New Photo',
      newAppointment: 'New Appointment',
      backToPatients: 'Back to Patient List',
      newPatient: '+ new patient',
      patientCheckIn: 'Patient Check In',
      scheduleSurgery: 'Schedule Surgery'
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
      cost: 'Cost',
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
      sexNotEntered: 'Sex Not Entered',
      operativePlan: 'Operative Plan',
      caption: 'Caption',
      patientTypeCharity: 'Charity',
      patientTypePrivate: 'Private'
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
      saved: 'The procedure record has been saved.'
    },
    buttons: {
      addMedication: 'Add Medication'
    }
  },
  reports: {
    titles: {
      saved: 'Report saved',
      opdReport: 'OPD Report',
      newOPDReport: 'New OPD Report',
      dischargeReport: 'Discharge Report',
      newDischargeReport: 'New Discharge Report'
    },
    labels: {
      visitDate: 'Date of Visit',
      admissionDate: 'Admission Date',
      dischargeDate: 'Discharge Date',
      notes: {
        title: 'Notes',
        date: 'Date',
        author: 'Author'
      },
      visitType: 'Visit Type',
      examiner: 'Examiner',
      location: 'Visit Location',
      primaryDiagnosis: 'Primary Diagnosis',
      secondaryDiagnosis: 'Secondary Diagnosis',
      procedures: 'Procedures',
      allProcedures: 'All Procedures Performed',
      labs: 'Labs',
      images: 'Images',
      medications: 'Medications',
      nextAppointment: 'Next Appointment',
      nextAppointments: 'Next Appointments',
      operativePlan: {
        title: 'Operative Plan',
        description: 'Operation Description',
        procedures: 'Planned Procedures',
        instructions: 'Instructions upon Admission'
      },
      completedBy: 'Completed By'
    },
    messages: {
      delete: 'Are you sure you wish to delete this report?',
      saved: 'The report has been saved.'
    }
  },
  components: {
    chargesByTypeTab: {
      charges: 'charges'
    },
    customFormManager: {
      buttons: {
        addForm: 'Add Form'
      }
    },
    sortableColumn: {
      labels: {
        selectAll: '(Select All)'
      }
    },
    imageUpload: {
      messages: {
        selectValidImageFile: 'Please select a valid image file.'
      }
    },
    dateTimePicker: {
      amHour: '{{hour}} AM',
      midnight: 'Midnight',
      noon: 'Noon',
      pmHour: '{{hour}} PM'
    },
    takePhoto: {
      how: 'How Do You Want To Add A Photo?',
      takePhoto: 'Take photo',
      uploadFile: 'Upload File',
      camera: 'Camera',
      photo: 'photo',
      preview: 'preview',
      labels: {
        takeAPicture: 'Take a Picture',
        uploadAFile: 'Upload a File'
      }
    },
    quantityConv: {
      unit: 'Unit',
      conversion: 'What does 1 {{name}} contain?'
    },
    quantityCalc: {
      result: '{{targetUnit}} total: {{calculated}}'
    },
    patientOrders: {
      buttons: {
        newImaging: 'New Imaging',
        newLab: 'New Lab',
        newMedication: 'New Medication'
      },
      labels: {
        imagingOrderType: 'Imaging',
        labOrderType: 'Lab',
        medicationOrderType: 'Medication',
        orderType: 'Order Type'
      }
    },
    priceList: {
      charges: '{{pricingType}} charges'
    },
    operativeProcedures: {
      buttons: {
        addProcedure: 'Add Procedure'
      },
      labels: {
        procedure: 'Procedure'
      },
      titles: {
        procedures: 'Procedures'
      }
    },
    upcomingAppointments: {
      labels: {
        date: 'Date',
        with: 'With',
        location: 'Location',
        type: 'Type'
      },
      titles: {
        upcomingAppointments: 'Upcoming Appointments'
      }
    }
  },
  customForms: {
    buttons: {
      addForm: 'Add Form'
    },
    labels: {
      formToAdd: 'Form To Add'
    },
    titles: {
      addCustomForm: 'Add Custom Form'
    }
  },
  diagnosis: {
    labels: {
      activeDiagnosis: 'Active Diagnosis',
      date: 'Date',
      diagnosis: 'Diagnosis',
      secondaryDiagnosis: 'Secondary Diagnosis'
    },
    titles: {
      addDiagnosis: 'Add Diagnosis',
      editDiagnosis: 'Edit Diagnosis'
    }
  },
  allergies: {
    buttons: {
      addAllergy: 'Add Allergy'
    },
    titles: {
      addAllergy: 'Add Allergy',
      editAllergy: 'Edit Allergy'
    },
    labels: {
      allergyName: 'Name',
      patientAllergy: 'Patient Allergies'
    }
  },
  operativePlan: {
    buttons: {
      completePlan: 'Complete Plan'
    },
    labels: {
      additionalNotes: 'Additional Notes',
      admissionInstructions: 'Instructions Upon Admission',
      caseComplexity: 'Case Complexity',
      completedStatus: 'Completed',
      droppedStatus: 'Dropped',
      operationDescription: 'Operation Description',
      plannedStatus: 'Planned',
      status: 'Status',
      surgeon: 'Surgeon'
    },
    messages: {
      planSaved: 'The operative plan has been saved.',
      planCompleted: 'The operative plan has been completed.  You will now be directed to the operation report.'
    },
    titles: {
      editTitle: 'Edit Operative Plan',
      newTitle: 'New Operative Plan',
      planCompleted: 'Plan Completed',
      planSaved: 'Plan Saved'
    }
  },
  operationReport: {
    labels: {
      additionalNotes: 'Additional Notes',
      assistant: 'Assistant',
      caseComplexity: 'Case Complexity',
      operationDescription: 'Operation Description',
      preOpPrimaryDiagnosis: 'Pre-op Primary Diagnosis',
      preOpSecondaryDiagnosis: 'Pre-op Secondary Diagnosis',
      surgeon: 'Surgeon',
      surgeryDate: 'Surgery Date'
    },
    messages: {
      reportSaved: 'The operation report has been saved.'
    },
    titles: {
      editTitle: 'Edit Operation Report',
      newTitle: 'New Operation Report',
      reportSaved: 'Report Saved'
    }
  },
  application: {
    messages: {
      sessionExpired: 'Your session has expired.  Please login to continue.'
    },
    titles: {
      sessionExpired: 'Session Expired'
    }
  },
  models: {
    appointment: {
      labels: {
        status: 'Status',
        appointmentType: 'Type',
        provider: 'With',
        location: 'Location',
        patient: 'Patient',
        startDate: 'Start Date',
        endDate: 'End Date',
        allDay: 'All Day',
        type: 'Type',
        notes: 'Notes',
        appointmentDate: 'Date'
      },
      names: {
        singular: 'appointment',
        plural: 'appointments'
      }
    },
    attachment: {
      names: {
        singular: 'attachment',
        plural: 'attachments'
      }
    },
    form: {
      names: {
        singular: 'form',
        plural: 'forms'
      }
    },
    incident: {
      names: {
        singular: 'incident',
        plural: 'incidents'
      }
    },
    item: {
      names: {
        singular: 'item',
        plural: 'items'
      }
    },
    imaging: {
      request: {
        singular: 'imaging request',
        plural: 'imaging requests'
      },
      names: 'imaging'
    },
    medication: {
      request: {
        singular: 'medication request',
        plural: 'medication requests'
      },
      names: {
        singular: 'medication',
        plural: 'medications'
      }
    },
    note: {
      names: {
        singular: 'note',
        plural: 'notes'
      }
    },
    lab: {
      request: {
        singular: 'lab request',
        plural: 'lab requests'
      },
      names: {
        singular: 'lab',
        plural: 'labs'
      }
    },
    procedure: {
      names: {
        singular: 'procedure',
        plural: 'procedures'
      }
    },
    user: {
      names: {
        singular: 'user',
        plural: 'users'
      }
    },
    visit: {
      names: {
        singular: 'visit',
        plural: 'visits'
      }
    },
    vital: {
      names: {
        singular: 'vital',
        plural: 'vitals'
      }
    },
    patient: {
      labels: {
        name: 'Name'
      },
      names: {
        singular: 'Patient'
      }
    }
  }
};
