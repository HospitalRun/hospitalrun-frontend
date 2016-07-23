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
    invalidNumber: 'not a valid number'
  },
  navigation: {
    imaging: 'Imaging',
    inventory: 'Inventory',
    patients: 'Patients',
    appointments: 'Appointments',
    medication: 'Medication',
    labs: 'Labs',
    billing: 'Billing',
    administration: 'Administration',
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
      thisWeek: 'This Week',
      today: 'Today',
      search: 'Search',
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
      missed: 'Missed',
      userRoles: 'User Roles',
      workflow: 'Workflow'
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
    loaddb: {
      progressMessage: 'Please wait while your database is loaded.',
      progressTitle: 'Loading Database',
      displayAlertTitle: 'Select File To Load',
      displayAlertMessage: 'Please select file to load.',
      errorDisplayAlertTitle: 'Error Loading',
      errorDisplayAlertMessage: `The database could not be imported. The error was: {{error}}`,
      editTitle: 'Load DB'
    },
    lookup: {
      deleteValueInventoryTypeMedicationTitle: 'Cannot Delete Medication',
      deleteValueInventoryTypeMedicationMessage: 'The Medication inventory type cannot be deleted because it is needed for the Medication module.',
      deleteValueLabPricingTypeProcedureTitle: 'Cannot Delete Lab Pricing Type',
      deleteValueLabPricingTypeProcedureMessage: 'The Lab Procedure pricing type cannot be deleted because it is needed for the Labs module.',
      deleteValueImagingPricingTypeProcedureTitle: 'Cannot Delete Imaging Pricing Type',
      deleteValueImagingPricingTypeProcedureMessage: 'The Imaging Procedure pricing type cannot be deleted because it is needed for the Imaging module.',
      deleteValueVisitTypeAdmissionTitle: 'Cannot Delete Admission Visit Type',
      deleteValueVisitTypeAdmissionMessage: 'The Admission Visit type cannot be deleted because it is needed for the Visits module.',
      deleteValueVisitTypeImagingTitle: 'Cannot Delete Imaging Visit Type',
      deleteValueVisitTypeImagingMessage: 'The Imaging Visit type cannot be deleted because it is needed for the Imaging module.',
      deleteValueVisitTypeLabTitle: 'Cannot Delete Lab Visit Type',
      deleteValueVisitTypeLabMessage: 'The Lab Visit type cannot be deleted because it is needed for the Lab module.',
      deleteValueVisitTypePharmacyTitle: 'Cannot Delete Pharmacy Visit Type',
      deleteValueVisitTypePharmacyMessage: 'The Lab Visit type cannot be deleted because it is needed for the Medication module.',
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
      wardPricingTypes: 'Ward Pricing Types'
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
        userRoles: 'User Roles'
      },
      messages: {
        roleSaved: 'The {{roleName}} role has been saved.'
      },
      titles: {
        roleSaved: 'Role Saved'
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
    imageOrders: 'Image Orders',
    labOrders: 'Lab Orders',
    patientHistory: 'Patient History',
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
    areYouSureDelete: 'Are you sure you wish to delete the user {{user}}?',
    userHasBeenSaved: 'The user has been saved.',
    userSaved: 'User Saved',
    onBehalfOf: 'on behalf of',
    newPatientHasToBeCreated: 'A new patient needs to be created...Please wait..',
    noNotesAvailable: 'No additional clinical notes are available for this visit.',
    sorry: 'Sorry, something went wrong...',
    forAuthorizedPersons: 'This report is for authorized persons only.'
  },
  alerts: {
    please_wait: 'Please Wait'
  },
  headings: {
    charged_items: 'Charged Items'
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
    edit: 'Edit',
    addLineItem: 'Add Line Item'
  },
  login: {
    messages: {
      signIn:  'please sign in',
      error:    'Username or password is incorrect.'
    },
    labels: {
      password: 'Password',
      username: 'Username',
      signIn:  'Sign in'
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
      transferred_from: 'Transferred From:',
      transferred_to: 'Transferred To:'
    },
    labels: {
      action: 'Action',
      add: 'Add',
      adjust: 'Adjust',
      adjustment_date: 'Adjustment Date',
      adjustment_for: 'Adjustment For',
      adjustment_type: 'Adjustment Type',
      aisle: 'Aisle',
      aisle_location: 'Aisle Location',
      all_inventory: 'All Inventory',
      bill_to: 'Bill To',
      consume_purchases: 'Consume Purchases',
      consumption_rate: 'Consumption Rate',
      cost: 'Cost',
      cost_per_unit: 'Cost per Unit',
      cross_reference: 'Cross Reference',
      current_quantity: 'Current Quantity',
      date_completed: 'Date Completed',
      date_effective: 'Effective Date',
      date_end: 'End Date',
      date_start: 'Start Date',
      date_received: 'Date Received',
      date_tranferred: 'Date Transferred',
      days_left: 'Days Left',
      delivery_aisle: 'Delivery Aisle',
      delivery_location: 'Delivery Location',
      distribution_unit: 'Distribution Unit',
      delete_item: 'Delete Item',
      details: 'Details',
      edit_item: 'Edit Item',
      expense: 'Expense To',
      expiration_date: 'Expiration Date',
      fulfill_request: 'Fulfill Request',
      fulfill_request_now: 'Fulfill Request Now',
      gift: 'Gift in Kind',
      gift_usage: 'Gift in Kind Usage',
      gift_in_kind_no: 'N',
      gift_in_kind_yes: 'Y',
      inventory_consumed: 'Inventory Consumed',
      inventory_item: 'Inventory Item',
      inventory_obsolence: 'Inventory Obsolence',
      invoice_items: 'Invoice Items',
      invoice_line_item: 'Invoice Line Item',
      invoice_number: 'Invoice Number',
      item: 'Item',
      items: 'Items',
      item_number: 'Item Number',
      location: 'Location',
      locations: 'Locations',
      name: 'Name',
      mark_as_consumed: 'Mark as Consumed',
      new_item: 'New Item',
      all_items: 'All Items',
      original_quantity: 'Original Quantity',
      print: 'Print',
      print_barcode: 'Print Barcode',
      printer: 'Printer',
      pull_from: 'Pull From',
      purchases: 'Purchases',
      purchase_cost: 'Purchase Cost',
      purchase_info: 'Purchase Information',
      quantity: 'Quantity ({{unit}})',
      quantity_available: 'Quantity Available',
      quantity_on_hand: 'Quantity on Hand',
      quantity_requested: 'Quantity Requested',
      rank: 'Rank',
      reason: 'Reason',
      remove: 'Remove',
      reorder_point: 'Reorder Point',
      requested_items: 'Requested Items',
      sale_price_per_unit: 'Sale Price per Unit',
      save: 'Save',
      serial_number: 'Serial/Lot Number',
      total: 'Total',
      total_cost: 'Total Cost',
      total_received: 'Total Received: {{total}}',
      transaction: 'Transaction',
      transactions: 'Transactions',
      transfer: 'Transfer',
      transfer_from: 'Transfer From',
      transfer_to: 'Transfer To Location',
      transfer_to_aisle: 'Transfer to Aisle Location',
      unit: 'Unit',
      unit_cost: 'Unit Cost',
      vendor: 'Vendor',
      vendor_item_number: 'Vendor Item Number',
      xref: 'XRef'
    },
    messages: {
      adjust: 'Please adjust the quantities on the appropriate location(s) to account for the difference of {{difference}}.',
      create_request: 'Create a new request?',
      delete: 'Are you sure you wish to delete {{name}}?',
      item_not_found: 'The inventory item <strong>{{item}}</strong> could not be found.<br>If you would like to create a new inventory item, fill in the information below.<br>Otherwise, press the Cancel button to return.',
      loading: 'Loading transactions ...',
      purchase_saved: 'The inventory purchases have been successfully saved.',
      no_requests: 'No requests found.',
      no_items: 'No items found.',
      quantity: 'The total quantity of <strong>({{quantity}})</strong> does not match the total quantity in the locations <strong>({{locationQuantity}})</strong>.',
      remove_item: 'Are you sure you want to remove this item from this invoice?',
      remove_item_request: 'Are you sure you want to remove this item from this request?',
      request_fulfilled: 'The inventory request has been fulfilled.',
      request_updated: 'The inventory request has been updated.',
      warning: 'Please fill in required fields (marked with *) and correct the errors before adding.'
    },
    reports: {
      rows: {
        adjustments: 'Adjustments',
        adjustments_total: 'Total Adjustments',
        balance_begin: 'Beginning Balance',
        balance_end: 'Ending Balance',
        category: 'Category',
        consumed: 'Consumed',
        consumed_gik: 'GiK Consumed',
        consumed_gik_total: 'Total GiK Consumed',
        consumed_puchases: 'Purchases Consumed',
        consumed_purchases_total: 'Total Purchases Consumed',
        consumed_total: 'Total Consumed',
        err_in_fin_sum: 'Error in _generateFinancialSummaryReport: ',
        err_in_find_pur: 'Error in _findInventoryItemsByPurchase: ',
        err_in_find_req: 'Error in _findInventoryItemsByRequest: ',
        expenses_for: 'Expenses For: ',
        no_account: '(No Account)',
        subtotal: 'Subtotal: ',
        subtotal_for: 'Subtotal for {{category}} - {{account}}: ',
        total: 'Total: ',
        total_for: 'Total for {{var}}: ',
        total_purchases: 'Total Purchases',
        transfer1: '{{quantity}} from {{location}}',
        trasnfer2: 'From: {{source}} To: {{target}}'
      },
      adjustment: 'Detailed Adjustment',
      days_supply: 'Days Supply Left In Stock',
      expense_detail: 'Detailed Expenses',
      expense_sum: 'Summary Expenses',
      expiration: 'Expiration Date',
      export: 'Export Report',
      fields: 'Fields to Include',
      finance: 'Finance Summary',
      generate: 'Generate Report',
      inv_location: 'Inventory By Location',
      inv_valuation: 'Inventory Valuation',
      purchase_detail: 'Detailed Purchase',
      purchase_sum: 'Summary Purchase',
      report_type: 'Report Type',
      stock_transfer_detail: 'Detailed Stock Transfer',
      stock_transfer_sum: 'Summary Stock Transfer',
      stock_usage_detail: 'Detailed Stock Usage',
      stock_usage_sum: 'Summary Stock Usage'
    },
    titles: {
      add_purchase: 'Add Purchase',
      add_request: 'New Request',
      adjustment: 'Adjustment',
      edit_purchase: 'Edit Purchase',
      edit_request: 'Edit Request',
      inventory_item: 'New Inventory Item',
      inventory_report: 'Inventory Report',
      purchase_saved: 'Inventory Purchases Saved',
      quick_add_title: 'New Inventory Item',
      remove_item: 'Remove Item',
      request_fulfilled: 'Request Fulfilled',
      request_updated: 'Request Updated',
      transfer: 'Transfer Items',
      warning: 'Warning!!!!!'
    }
  },
  imaging: {
    page_title: 'Imaging Requests',
    section_title: 'Imaging',
    buttons: {
      new_button: '+ new imaging'
    },
    labels: {
      radiologist: 'Radiologist',
      add_new_visit: '--Add New Visit--'
    },
    messages: {
      no_completed: 'No completed items found.'
    },
    titles: {
      completed_imaging: 'Completed Imaging',
      edit_title: 'Edit Imaging Request',
      new_title: 'New Imaging Request'
    },
    alerts: {
      completed_title: 'Imaging Request Completed',
      completed_message: 'The imaging request has been completed.',
      saved_title: 'Imaging Request Saved',
      saved_message: 'The imaging request has been saved.'
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
      authoredBy: 'Authored By',
      labs: 'Labs',
      imaging: 'Imaging',
      visitInformation: 'Visit Information',
      examiner: 'Examiner',
      medication: 'Medication',
      status: 'Visit Status',
      admittingDiagnosis: 'Admitting Diagnosis',
      finalDiagnosis: 'Final/Billing Diagnosis',
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
      savedPatient: 'Patient Saved'
    },
    messages: {
      areYouSureDelete: 'Are you sure you want to delete this {{object}}?',
      deletePatient: 'Are you sure you wish to delete {{firstName}} {{lastName}}?',
      noPatientsFound: 'No patients found.',
      savedPatient: 'The patient record for {{displayName}} has been saved.',
      notFoundQuickAdd: 'The patient <strong>{{patientFullName}}</strong> could not be found.  If you would like to create a new patient, fill in the information below.  Otherwise press the Cancel button to return.',
      createNewPatient: 'Create a new patient record?'
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
      parent: 'Parent/Guardian'
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
