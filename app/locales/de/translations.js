export default {
  dashboard: {
    title: 'Was möchten Sie tun?'
  },
  navigation: {
    imaging: 'Bildgebung',
    inventory: 'Inventar',
    patients: 'Patienten',
    appointments: 'Termine',
    medication: 'Medikation',
    labs: 'Labore',
    billing: 'Abrechnung',
    administration: 'Administration',
    subnav: {
      requests: 'Anfragen',
      items: 'Einheiten',
      completed: 'Erledigt',
      new_request: 'Neue Anfrage',
      inventory_received: 'Eingeganges Inventar',
      reports: 'Berichte',
      patient_listing: 'Patietenliste',
      new_patient: 'Neuer Patient',
      this_week: 'Diese Woche',
      today: 'Heute',
      search: 'Suche',
      add_appointment: 'Termin eintragen',
      dispense: 'Verabreichen',
      return_medication: 'Medikamente zurückgeben',
      invoices: 'Rechnungen',
      new_invoice: 'Neue Rechnung',
      prices: 'Kosten',
      price_profiles: 'Preisprofile',
      lookup_lists: 'Nachschlagelisten',
      address_fields: 'Adressfelder',
      load_db: 'Datenbank laden',
      users: 'Benutzer',
      new_user: 'Neuer Benutzer'
    },
    actions: {
      logout: 'Abmelden',
      login: 'Anmelden'
    },
    about: 'Über HospitalRun'
  },
  labels: {
    name: 'Name',
    patient: 'Patient',
    quantity: 'Anzahl',
    requested_on: 'Angefragt am',
    date_requested: 'Anfragedatum',
    date_completed: 'Abschlussdatum',
    requested_by: 'Angefragt von',
    fulfill: 'Ausführen',
    actions: 'Aktionen',
    action: 'Aktion',
    notes: 'Notizen',
    edit: 'Bearbeiten',
    imaging_type: 'Bildgebungsart',
    result: 'Ergebnis',
    results: 'Ergebnisse',
    visit: 'Besuch',
    requests: 'Anfragen',
    completed: 'Erledigt',
    id: 'Id-Nr',
    sex: 'Geschlecht',
    age: 'Alter'
  },
  messages: {
    no_items_found: 'Keine Einträge gefunden.',
    create_new_record: 'Neuen Eintrag erstellen?'
  },
  buttons: {
    complete: 'Abschließen',
    cancel: 'Abbrechen',
    return_button: 'Zurück',
    add: 'Hinzufügen',
    update: 'Aktualisieren',
    ok: 'Okay'
  },
  login: {
    messages: {
      sign_in:  'Bitte anmelden',
      error:    'Benutzername oder Passwort falsch.'
    },
    labels: {
      password: 'Passwort',
      username: 'Benutzername',
      sign_in:  'Anmelden'
    }
  },
  inventory: {
    messages: {
      no_requests: 'Keine Anfragen gefunden.',
      create_request: 'Neue Anfrage erstellen?'
    }
  },
  imaging: {
    page_title: 'Anfrage zur Bildgebung',
    section_title: 'Bildgebung',
    buttons: {
      new_button: '+ Neue Bildgebung'
    },
    labels: {
      radiologist: 'Radiologe',
      add_new_visit: '--Neuen Besuch hinzufügen--'
    },
    messages: {
      no_completed: 'Keine erledigten Einträge gefunden.'
    },
    titles: {
      completed_imaging: 'Erledigte Bildgebung',
      edit_title: 'Bildgebungs-Anfrage bearbeiten',
      new_title: 'Neue Bildgebungs-Anfrage'
    },
    alerts: {
      completed_title: 'Bildgebungs-Anfrage gestellt',
      completed_message: 'Die Anfrage zur Bildgebung wurde abgeschlossen.',
      saved_title: 'Bildgebungs-Anfrage gespeichert',
      saved_message: 'Die Anfrage zur Bildgebung wurde gespeichert.'
    }
  }
};
