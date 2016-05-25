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
      new_user: 'New User',
      user_roles: 'User Roles'
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
    user_roles: 'User Roles',
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
      },
      new_title: 'Address Options',
      edit_title: 'Address Options',
      address_label: 'Address'
    },
    loaddb: {
      progress_message: 'Please wait while your database is loaded.',
      progress_title: 'Loading Database',
      display_alert_title: 'Select File To Load',
      display_alert_message: 'Please select file to load.',
      error_display_alert_title: 'Error Loading',
      error_display_alert_message: `The database could not be imported. The error was: {{error}}`,
      edit_title: 'Load DB'
    },
    lookup: {
      delete_value_inventory_type_medication_title: 'Cannot Delete Medication',
      delete_value_inventory_type_medication_message: 'The Medication inventory type cannot be deleted because it is needed for the Medication module.',
      delete_value_lab_pricing_type_procedure_title: 'Cannot Delete Lab Pricing Type',
      delete_value_lab_pricing_type_procedure_message: 'The Lab Procedure pricing type cannot be deleted because it is needed for the Labs module.',
      delete_value_imaging_pricing_type_procedure_title: 'Cannot Delete Imaging Pricing Type',
      delete_value_imaging_pricing_type_procedure_message: 'The Imaging Procedure pricing type cannot be deleted because it is needed for the Imaging module.',
      delete_value_visit_type_admission_title: 'Cannot Delete Admission Visit Type',
      delete_value_visit_type_admission_message: 'The Admission Visit type cannot be deleted because it is needed for the Visits module.',
      delete_value_visit_type_imaging_title: 'Cannot Delete Imaging Visit Type',
      delete_value_visit_type_imaging_message: 'The Imaging Visit type cannot be deleted because it is needed for the Imaging module.',
      delete_value_visit_type_lab_title: 'Cannot Delete Lab Visit Type',
      delete_value_visit_type_lab_message: 'The Lab Visit type cannot be deleted because it is needed for the Lab module.',
      delete_value_visit_type_pharmacy_title: 'Cannot Delete Pharmacy Visit Type',
      delete_value_visit_type_pharmacy_message: 'The Lab Visit type cannot be deleted because it is needed for the Medication module.',
      alert_import_list_title: 'Select File To Import',
      alert_import_list_message: 'Please select file to import.',
      alert_import_list_save_title: 'List Imported',
      alert_import_list_save_message: 'The lookup list has been imported.',
      alert_import_list_update_title: 'List Saved',
      alert_import_list_update_message: 'The lookup list has been saved.',
      page_title: 'Lookup Lists',
      edit: {
        add_title: 'Add Value',
        edit_title: 'Edit Value',
        name: 'Name',
        update_button_text_add: 'Add',
        update_button_text_update: 'Update',
        value: 'Value'
      },
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
      incident_location: 'Incident Locations',
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
    },
    roles: {
      capability: {
        admin: 'Administration',
        load_db: 'Load Database',
        update_config: 'Update Configurations',
        appointments: 'Appointments',
        add_appointment: 'Add Appointment',
        billing: 'Billing',
        add_charge: 'Add Charge',
        add_pricing: 'Add Pricing',
        add_pricing_profile: 'Add Pricing Profile',
        add_invoice: 'Add Invoice',
        add_payment: 'Add Payment',
        delete_invoice: 'Delete Invoice',
        delete_pricing: 'Delete Pricing',
        delete_pricing_profile: 'Delete Pricing Profile',
        edit_invoice: 'Edit Invoice',
        invoices: 'Invoices',
        override_invoice: 'Override Invoice',
        pricing: 'Pricing',
        patients: 'Patients',
        add_diagnosis: 'Add Diagnosis',
        add_photo: 'Add Photo',
        add_patient: 'Add Patient',
        add_visit: 'Add Visit',
        add_vitals: 'Add Vitals',
        admit_patient: 'Admit Patient',
        delete_photo: 'Delete Photo',
        delete_patient: 'Delete Patient',
        delete_appointment: 'Delete Appointment',
        delete_diagnosis: 'Delete Diagnosis',
        delete_procedure: 'Delete Procedure',
        delete_socialwork: 'Delete Social Work',
        delete_vitals: 'Delete Vitals',
        delete_visit: 'Delete Visit',
        discharge_patient: 'Discharge Patient',
        patient_reports: 'Patient Reports',
        visits: 'Visits',
        medication: 'Medication',
        add_medication: 'Add Medication',
        delete_medication: 'Delete Medication',
        fulfill_medication: 'Fulfill Medication',
        labs: 'Labs',
        add_lab: 'Add Lab',
        complete_lab: 'Complete Lab',
        delete_lab: 'Delete Lab',
        imaging: 'Imaging',
        add_imaging: 'Add Imaging',
        complete_imaging: 'Complete Imaging',
        delete_imaging: 'Delete Imaging',
        inventory: 'Inventory',
        add_inventory_request: 'Add Inventory Request',
        add_inventory_item: 'Add Inventory Item',
        add_inventory_purchase: 'Add Inventory Purchase',
        adjust_inventory_location: 'Adjust Inventory Location',
        delete_inventory_item: 'Delete Inventory Item',
        delete_inventory_purchase: 'Delete Inventory Purchase',
        fulfill_inventory: 'Fulfill Inventory',
        user_roles: 'User Roles',
        incident: 'Incident',
        add_contributing_factor: 'Add Contributing Factor',
        add_feedback: 'Add Feedback',
        add_incident: 'Add Incident',
        add_incident_category: 'Add Incident Category',
        add_investigation_finding: 'Add Investigation Finding',
        add_recommendation: 'Add Recommendation',
        add_reviewer: 'Add Reviewer',
        add_risk: 'Add Risk',
        add_summary: 'Add Summary',
        delete_contributing_factor: 'Delete Contributing Factor',
        delete_feedback: 'Delete Feedback',
        delete_incident: 'Delete Incident',
        delete_incident_category: 'Delete Incident Category',
        delete_investigation_finding: 'Delete Investigation Finding',
        delete_recommendation: 'Delete Recommendation',
        delete_reviewer: 'Delete Reviewer',
        delete_risk: 'Delete Risk',
        edit_others_incident: 'Edit Other\'s Incidents',
        generate_incident_report: 'Generate Incident Report'
      },
      messages: {
        role_saved: 'The {{roleName}} role has been saved.'
      },
      titles: {
        role_saved: 'Role Saved'
      }
    }
  },
  labels: {
    cptcode: 'CPT Code',
    loading: 'Loading',
    name: 'Name',
    patient: 'Patient',
    quantity: 'Quantity',
    requested_on: 'Requested On',
    date: 'Date',
    date_of_birth: 'Date of Birth',
    date_of_birth_short: 'DoB',
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
    image_orders: 'Image Orders',
    lab_orders: 'Lab Orders',
    patient_history: 'Patient History',
    imaging_type: 'Imaging Type',
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
    start_date: 'Start Date',
    end_time: 'End Time',
    end_date: 'End Date',
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
    delete_request: 'Delete Request',
    location: 'Location',
    provider: 'Provider',
    with: 'With',
    all_day: 'All Day',
    physician: 'Physician',
    assisting: 'Assisting',
    anesthesia: 'Anesthesia',
    procedures: 'Procedures'
  },
  messages: {
    no_items_found: 'No items found.',
    no_history_available: 'No history available.',
    create_new_record: 'Create a new record?',
    create_new_user: 'Create a new user?',
    no_users_found: 'No users found.',
    are_you_sure_delete: 'Are you sure you wish to delete the user {{user}}?',
    user_has_been_saved: 'The user has been saved.',
    user_saved: 'User Saved',
    on_behalf_of: 'on behalf of',
    new_patient_has_to_be_created: 'A new patient needs to be created...Please wait..',
    no_notes_available: 'No additional clinical notes are available for this visit.',
    sorry: 'Sorry, something went wrong...'
  },
  alerts: {
    please_wait: 'Please Wait'
  },
  buttons: {
    complete: 'Complete',
    cancel: 'Cancel',
    close: 'Close',
    return_button: 'Return',
    barcode: 'Barcode',
    add: 'Add',
    update: 'Update',
    ok: 'OK',
    fulfill: 'Fulfill',
    remove: 'Remove',
    delete: 'Delete',
    new_user: 'New User',
    add_value: 'Add Value',
    new_note: 'New Note',
    import: 'Import',
    load_file: 'Load File',
    new_request: 'New Request',
    all_requests: 'All Requests',
    dispense: 'Dispense',
    new_item: '+ new item',
    new_request_plus: '+ new request',
    add_visit: 'Add Visit',
    search: 'Search'
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
  incident: {
    buttons: {
      add: 'Add',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      export: 'Export Report',
      generate_rep: 'Generate Report',
      generate_sum: 'Generate Summary',
      new_feedback: '+ new feedback',
      new_finding: '+ new investigation finding',
      new_incident: '+ new incident',
      new_recommendation: '+ new recommendation',
      new_reviewer: '+ new reviewer'
    },
    labels: {
      actions: 'Actions',
      actions_taken: 'Actions Taken',
      activity: 'Activity/Plan',
      added_by: 'Added By',
      added_on: 'Added On',
      category: 'Category',
      choose: 'Choose an item',
      communication_factors: 'Communication Factors',
      contributory_factors: 'Contributory Factors',
      components: 'Components',
      date: 'Date',
      date_recorded: 'Date Recorded',
      description: 'Description',
      details: 'Details',
      educational_factors: 'Educational and Training Factors',
      end_date: 'End Date',
      equipment_factors: 'Equipment Factors',
      feedback: 'Feedback',
      given_by: 'Given By',
      harm_score: 'HARM Score:',
      harm_duration: 'What is the anticipated duration of the harm to the individual?',
      harm_prompt: 'What is the extent of the harm to the individual at the time of the assessment?',
      id_number: 'ID Number',
      id_type: 'Identification Document Type',
      incident_category: 'Incident Type Category',
      incident_date: 'Date of Incident',
      incident_date_sum: 'Incident Date:',
      incident_desc: 'Incident Description',
      incident_id: 'Incident ID',
      incident_item: 'Incident Type Item',
      incident_location: 'Location of Incident',
      incident_location_sum: 'Location of Incident:',
      incident_type: 'Incident Type:',
      lessons_learned: 'Lessons Learned',
      narrative_statement: 'Narrative Statement',
      occurrence: 'Occurrence',
      organizational_factors: 'Organizational Factors',
      other: 'Other (Please specify)',
      patient_factors: 'Patient Factors',
      recommendations: 'Recommendations',
      report_type: 'Report Type',
      reported_by: 'Reported By',
      reported_to: 'Incident Reported to (Full Name)',
      risk_score: 'Risk Score = Severity * Occurrence',
      responsibility: 'Responsibility',
      reviewer_email: 'Reviewer Email',
      reviewer_name: 'Reviewer Name',
      root_cause_summary: 'Root Cause Summary',
      severity: 'Severity',
      staff_factors: 'Staff Factors',
      start_date: 'Start Date',
      status: 'Status',
      target_date: 'Target Date of Completion',
      task_factors: 'Task Factors',
      team_factors: 'Team Factors',
      type_of_person: 'Type of Person Involved',
      witness: 'Witness (Full Name)',
      work_factors: 'Work Environment Factors'
    },
    messages: {
      create_new: 'Create a new incident?',
      delete: 'Are you sure you wish to delete {{name}}?',
      fill_in: 'Fill in the above options to calculate score',
      incident_id: 'Incident ID: {{id}}',
      no_incidents: 'No incidents found.',
      no_closed_incidents: 'No closed incidents found.',
      occurence: 'Occurence:',
      risk_score: 'Risk Score:',
      saved: 'The incident report has been saved.',
      severity: 'Severity:',
      status: 'Status: {{status}}'
    },
    tabs: {
      creation: 'Creation',
      feedback: 'Feedback',
      harm_score: 'HARM Score',
      investigations: 'Investigations',
      pre_risk: 'Pre-Incident Asst',
      post_risk: 'Post-Incident Asst',
      recommendations: 'Recommendations',
      reviewers: 'Reviewers',
      root_cause: 'Root Cause Analysis',
      summary: 'Summary'
    },
    titles: {
      add_recommendation: 'Add Recommendation',
      add_reviewer: 'Add Reviewer',
      add_reviewers: 'Add Reviewers',
      add_feedback: 'Add Feedback',
      add_finding: 'Add Investigation Finding',
      as_reviewer: 'Incidents as Reviewer',
      cfcf: 'Contributory Factors Classification Framework',
      closed: 'Closed Incidents',
      current: 'Current',
      delete_feedback: 'Delete Feedback',
      delete_finding: 'Delete Investigation Finding',
      delete_item: 'Delete Item',
      delete_recommendation: 'Delete Recommendation',
      delete_reviewer: 'Delete Reviewer',
      edit_feedback: 'Edit Feedback',
      edit_finding: 'Edit Investigation Finding',
      edit_incident: 'Edit Incident',
      edit_reviewer: 'Edit Reviewer',
      edit_recommendation: 'Edit Recommendation',
      feedback_list: 'Feedback List',
      incident_saved: 'Incident Saved',
      findings: 'Investigation Findings',
      findings2: 'Narrative Statements from People Involved',
      general: 'General Information',
      harm_score: 'HARM Score',
      history: 'History',
      incident_type: 'Incident Type',
      incidents: 'Incidents',
      new_incident: 'New Incident',
      pre_risk: 'Pre-Incident Risk Assessment',
      post_risk: 'Post-Incident Risk Assessment',
      rca: 'Root Cause Analysis (RCA)',
      recommendations: 'Recommendations',
      reports: 'Reports',
      summary: 'Summary'
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
  },
  appointments: {
    current_screen_title: 'Appointment List',
    edit_title: 'Edit Appointment',
    new_title: 'New Appointment',
    section_title: 'Appointments',
    this_week: 'Appointments This Week',
    missed: 'Missed Appointments',
    search_title: 'Search Appointments',
    today_title: 'Today\'s Appointments',
    messages: {
      delete_appointment_message: 'Are you sure you wish to delete this appointment?',
      end_time_later_than_start: 'Please select an end time later than the start time.'
    },
    buttons: {
      new_button: '+ new appointment'
    }
  },
  visits: {
    edit: {
      actions: 'Actions',
      edit: 'Edit',
      date: 'Date',
      authored_by: 'Authored By',
      note: 'Note',
      notes: 'Notes',
      new_note: 'New Note',
      visit_information: 'Visit Information',
      new_appointment: 'New Appointment',
      add_diagnosis: 'Add Diagnosis',
      diagnosis: 'Diagnosis',
      delete: 'Delete',
      procedure: 'Procedure',
      procedures: 'Procedures',
      new_procedure: 'New Procedure',
      labs: 'Labs',
      new_lab: 'New Lab',
      imaging: 'Imaging',
      new_imaging: 'New Imaging',
      medication: 'Medication',
      new_medication: 'New Medication'
    }
  },
  labs: {
    section_title: 'Labs',
    requests_title: 'Lab Requests',
    edit_title: 'Edit Lab Request',
    new_title: 'New Lab Request',
    delete_title: 'Delete Request',
    completed_title: 'Completed Labs',
    labels: {
      lab_type: 'Lab Type',
      add_new_visit: '--Add New Visit--'
    },
    messages: {
      no_items_found: 'No labs found.',
      create_new_record: 'Create a new record?',
      confirm_deletion: 'Are you sure you wish to delete this lab request?',
      no_completed: 'No completed items found.'
    },
    buttons: {
      new_button: '+ new lab'
    },
    alerts: {
      request_completed_title: 'Lab Request Completed',
      request_completed_message: 'The lab request has been completed.',
      request_saved_title: 'Lab Request Saved',
      request_saved_message: 'The lab request has been saved.'
    }
  },
  common: {
    actions: 'Actions'
  },
  patients: {
    notes: {
      on_behalf_of_label: 'On Behalf Of',
      on_behalf_of_copy: 'on behalf of',
      please_select_a_visit: 'Please select a visit',
      note_label: 'Note'
    }
  }
};
