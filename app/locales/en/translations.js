export default {
  dashboard: {
    title: 'What would you like to do?'
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
      requests: 'Requests',
      items: 'Items',
      completed: 'Completed',
      new_request: 'New Request',
      inventory_received: 'Inventory Received',
      reports: 'Reports',
      patient_listing: 'Patient Listing',
      new_patient: 'New Patient',
      this_week: 'This Week',
      today: 'Today',
      search: 'Search',
      add_appointment: 'Add Appointment',
      dispense: 'Dispense',
      return_medication: 'Return Medication',
      invoices: 'Invoices',
      new_invoice: 'New Invoice',
      prices: 'Prices',
      price_profiles: 'Price Profiles',
      lookup_lists: 'Lookup Lists',
      address_fields: 'Address Fields',
      load_db: 'Load DB',
      users: 'Users',
      new_user: 'New User'
    },
    actions: {
      logout: 'Logout',
      login: 'Login'
    },
    about: 'About HospitalRun'
  },
  user: {
    plus_new_user: '+ new user',
    users_page_tile: 'User Listing'
  },
  admin: {
    address_options: 'Address Options',
    lookup_lists: 'Lookup Lists',
    load_db: 'Load DB',
    users: 'Users',
    address: {
      address1_label: 'Address 1 Label',
      address2_label: 'Address 2 Label',
      address3_label: 'Address 3 Label',
      address4_label: 'Address 4 Label',
      include1_label: 'Include 1 Label',
      include2_label: 'Include 2 Label',
      include3_label: 'Include 3 Label',
      include4_label: 'Include 4 Label',
      titles: {
        options_saved: 'Options Saved'
      },
      messages: {
        address_saved: 'The address options have been saved'
      }
    },
    lookup: {
      anesthesia_types: 'Anesthesia Types',
      anesthesiologists: 'Anesthesiologists',
      billing_categories: 'Billing Categories',
      clinic_list: 'Clinic Locations',
      country_list: 'Countries',
      diagnosis_list: 'Diagnoses',
      cpt_code_list: 'CPT Codes',
      expense_account_list: 'Expense Accounts',
      aisle_location_list: 'Inventory Aisle Locations',
      warehouse_list: 'Inventory Locations',
      inventory_types: 'Inventory Types',
      imaging_pricing_types: 'Imaging Pricing Types',
      lab_pricing_types: 'Lab Pricing Types',
      patient_status_list: 'Patient Status List',
      physician_list: 'Physicians',
      procedure_list: 'Procedures',
      procedure_locations: 'Procedures Locations',
      procedure_pricing_types: 'Procedure Pricing Types',
      radiologists: 'Radiologists',
      unit_types: 'Unit Types',
      vendor_list: 'Vendor',
      visit_location_list: 'Visit Locations',
      visit_types: 'Visit Types',
      ward_pricing_types: 'Ward Pricing Types'
    }
  },
  labels: {
    name: 'Name',
    patient: 'Patient',
    quantity: 'Quantity',
    requested_on: 'Requested On',
    date: 'Date',
    date_requested: 'Date Requested',
    date_completed: 'Date Completed',
    description: 'Description',
    requested_by: 'Requested By',
    fulfill: 'Fulfill',
    fulfill_request: 'Fulfill Request',
    fulfill_request_now: 'Fulfill Request Now',
    actions: 'Actions',
    action: 'Action',
    notes: 'Notes',
    edit: 'Edit',
    imaging_type: 'Imaging Type',
    result: 'Result',
    results: 'Results',
    visit: 'Visit',
    type: 'Type',
    requests: 'Requests',
    completed: 'Completed',
    id: 'ID',
    sex: 'Sex',
    age: 'Age',
    username: 'Username',
    email: 'Email',
    role: 'Role',
    delete: 'Delete',
    user_can_add_new_value: 'User Can Add New Values',
    value: 'Value',
    lookup_type: 'Lookup Type',
    import_file: 'Import File',
    file_load_successful: 'File To Load Successful',
    file_to_Load: 'File Load',
    start_time: 'Start Time',
    end_time: 'End Time',
    doc_read: 'Docs Read',
    doc_written: 'Docs Written',
    display_name: 'Display Name',
    password: 'Password',
    edit_user: 'Edit User',
    new_user: 'New User',
    delete_user: 'Delete User',
    medication: 'Medication',
    status: 'Status',
    add_new_outpatient_visit: '--Add New Outpatient Visit--',
    prescription: 'Prescription',
    prescription_date: 'Prescription Date',
    bill_to: 'Bill To',
    pull_from: 'Pull From',
    fulfilled: 'Fulfilled',
    delete_request: 'Delete Request'
  },
  messages: {
    no_items_found: 'No items found.',
    create_new_record: 'Create a new record?',
    create_new_user: 'Create a new user?',
    no_users_found: 'No users found.',
    are_you_sure_delete: 'Are you sure you wish to delete the user {{user}}?',
    user_has_been_saved: 'The user has been saved.',
    user_saved: 'User Saved',
    new_patient_has_to_be_created: 'A new patient needs to be created...Please wait..'
  },
  alerts: {
    please_wait: 'Please Wait'
  },
  buttons: {
    complete: 'Complete',
    cancel: 'Cancel',
    return_button: 'Return',
    add: 'Add',
    update: 'Update',
    ok: 'Ok',
    remove: 'Remove',
    delete: 'Delete',
    new_user: 'New User',
    add_value: 'Add Value',
    import: 'Import',
    load_file: 'Load File',
    new_request: 'New Request',
    all_requests: 'All Requests',
    dispense: 'Dispense'
  },
  login: {
    messages: {
      sign_in:  'please sign in',
      error:    'Username or password is incorrect.'
    },
    labels: {
      password: 'Password',
      username: 'Username',
      sign_in:  'Sign in'
    }
  },
  inventory: {
    labels: {
      action: 'Action',
      add: 'Add',
      adjustment_date: 'Adjustment Date',
      adjustment_for: 'Adjustment For',
      adjustment_type: 'Adjustment Type',
      aisle_location: 'Aisle Location',
      bill_to: 'Bill To',
      consume_purchases: 'Consume Purchases',
      cost: 'Cost',
      cross_reference: 'Cross Reference',
      current_quantity: 'Current Quantity',
      date_received: 'Date Received',
      delivery_aisle: 'Delivery Aisle',
      delivery_location: 'Delivery Location',
      distribution_unit: 'Distribution Unit',
      delete_item: 'Delete Item',
      expense: 'Expense To',
      expiration_date: 'Expiration Date',
      fulfill_request: 'Fulfill Request',
      fulfill_request_now: 'Fulfill Request Now',
      gift: 'Gift in Kind',
      inventory_item: 'Inventory Item',
      invoice_items: 'Invoice Items',
      invoice_line_item: 'Invoice Line Item',
      invoice_number: 'Invoice Number',
      item: 'Item',
      item_number: 'Item Number',
      location: 'Location',
      name: 'Name',
      mark_as_consumed: 'Mark as Consumed',
      print: 'Print',
      print_barcode: 'Print Barcode',
      printer: 'Printer',
      pull_from: 'Pull From',
      purchase_cost: 'Purchase Cost',
      quantity: 'Quantity ({{unit}})',
      quantity_on_hand: 'Quantity on Hand',
      quantity_requested: 'Quantity Requested',
      reason: 'Reason',
      remove: 'Remove',
      reorder_point: 'Reorder Point',
      requested_items: 'Requested Items',
      sale_price_per_unit: 'Sale Price per Unit',
      save: 'Save',
      serial_number: 'Serial/Lot Number',
      total_received: 'Total Received: {{total}}',
      unit: 'Unit',
      vendor: 'Vendor',
      vendor_item_number: 'Vendor Item Number'
    },
    messages: {
      create_request: 'Create a new request?',
      delete: 'Are you sure you wish to delete {{name}}?',
      item_not_found: 'The inventory item <strong>{{item}}</strong> could not be found.<br>If you would like to create a new inventory item, fill in the information below.<br>Otherwise, press the Cancel button to return.',
      purchase_saved: 'The inventory purchases have been successfully saved.',
      no_requests: 'No requests found.',
      remove_item: 'Are you sure you want to remove this item from this invoice?',
      warning: 'Please fill in required fields (marked with *) and correct the errors before adding.'
    },
    titles: {
      adjustment: 'Adjustment',
      purchase_saved: 'Inventory Purchases Saved',
      quick_add_title: 'New Inventory Item',
      remove_item: 'Remove Item',
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
    page_title: 'Medication Requests',
    section_title: 'Medication',
    return_medication: 'Return Medication',
    buttons: {
      dispense_medication: 'dispense medication',
      new_button: '+ new request',
      return_medication: 'return medication'
    },
    titles: {
      completed_medication: 'Completed Medication',
      edit_medication_request: 'Edit Medication Request',
      new_medication_request: 'New Medication Request'
    },
    messages: {
      create_new: 'Create a new medication request?',
      confirm_deletion: 'Are you sure you wish to delete this medication request?'
    },
    labels: {
      refills: 'Refills',
      quantity_requested: 'Quantity Requested',
      quantity_dispensed: 'Quantity Dispensed',
      quantity_distributed: 'Quantity Distributed',
      quantity_to_return: 'Quantity To Return',
      return_location: 'Return Location',
      return_aisle: 'Return Aisle',
      return_reason: 'Return Reason/Notes',
      adjustment_date: 'Adjustment Date',
      credit_to_account: 'Credit To Account'
    },
    alerts: {
      returned_title: 'Medication Returned',
      returned_message:  'The medication has been marked as returned.',
      saved_title: 'Medication Request Saved',
      saved_message: 'The medication record has been saved.',
      fulfilled_title: 'Medication Request Fulfilled'
    }
  }
};
