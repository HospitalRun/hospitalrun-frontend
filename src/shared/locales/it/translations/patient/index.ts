export default {
  patient: {
    code: 'Codice del paziente',
    firstName: 'Nome',
    lastName: 'Cognome',
    suffix: 'Suffisso',
    prefix: 'Prefisso',
    givenName: 'Nome',
    familyName: 'Cognome',
    dateOfBirth: 'Data di nascita',
    approximateDateOfBirth: 'Data presunta di nascita',
    age: 'Anni',
    approximateAge: 'Anni presunti',
    placeOfBirth: 'Luogo di nascita',
    sex: 'Sesso',
    phoneNumber: 'Numero di telefono',
    email: 'Email',
    address: 'Indirizzo',
    occupation: 'Occupazione',
    type: 'Tipo di paziente',
    preferredLanguage: 'Lingua',
    basicInformation: 'Informazioni base',
    generalInformation: 'Informazioni generali',
    contactInformation: 'Informazioni di contatto',
    unknownDateOfBirth: 'Sconosciuto',
    relatedPerson: 'Relazione di parentela',
    relatedPersons: {
      error: {
        unableToAddRelatedPerson: 'Impossibile aggiungere relazione di parentela.',
        relatedPersonRequired: 'Il campo relazione di parentela è obbligatorio.',
        relationshipTypeRequired: 'Il tipo di relazione è obbligatorio.',
      },
      label: 'Relazioni di parentela',
      new: 'Nuova relazione di parentela',
      add: 'Aggiungi relazione di parentela',
      relationshipType: 'Tipo di relazione',
      warning: {
        noRelatedPersons: 'Non ci sono relazioni di parentela',
      },
      addRelatedPersonAbove:
        'Aggiungi una nuova relazione di parentela usando il pulsante soprastante.',
    },
    appointments: {
      new: 'Aggiungi appuntamento',
    },
    allergies: {
      label: 'Allergie',
      allergyName: "Nome dell'allergia",
      new: 'Aggiungi allergia',
      error: {
        nameRequired: 'Il nome è obbligatorio.',
        unableToAdd: "Impossibile aggiungere l'allergia.",
      },
      warning: {
        noAllergies: 'Non ci sono allergie',
      },
      addAllergyAbove: 'Aggiungi un allergia utilizzando il pulsante soprastante.',
      successfullyAdded: 'Allergia aggiunta con successo!',
    },
    diagnoses: {
      label: 'Diagnosi',
      new: 'Aggiungi diagnosi',
      diagnosisName: 'Nome',
      diagnosisDate: 'Data',
      warning: {
        noDiagnoses: 'Non ci sono diagnosi',
      },
      error: {
        nameRequired: 'Il nome della diagnosi è obbligatorio.',
        dateRequired: 'La data della diagnosi è obbligatorio.',
        unableToAdd: 'Impossibile aggiungere la diagnosi',
      },
      addDiagnosisAbove: 'Aggiungi la diagnosi utilizzando il pulsante soprastante.',
      successfullyAdded: 'Diagnosi aggiunta con successo!',
    },
    note: 'Nota',
    notes: {
      label: 'Note',
      new: 'Aggiungi nuova nota',
      warning: {
        noNotes: 'Non ci sono note',
      },
      error: {
        noteRequired: 'Il campo nota è obbligatorio.',
        unableToAdd: 'Impossibile aggiungere la nota.',
      },
      addNoteAbove: 'Aggiungi una nota utilizzando il pulsante soprastante.',
    },
    medications: {
      label: 'Farmaci',
      new: 'Aggiungi nuovo farmaco',
      warning: {
        noMedications: 'Nessun farmaco',
      },
      noMedicationsMessage: 'Nessuna richiesta di farmaci per questa persona.',
    },
    types: {
      charity: 'Beneficenza',
      private: 'Privato',
    },
    errors: {
      createPatientError: 'Impossibile aggiungere il paziente.',
      updatePatientError: 'Impossibile aggiornare il paziente.',
      patientGivenNameFeedback: 'Il nome è obbligatorio.',
      patientDateOfBirthFeedback: 'La data di nascita non può essere maggiore della data odierna',
    },
  },
}
