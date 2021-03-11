export default {
  patient: {
    code: 'Code patient',
    firstName: 'Prénom',
    lastName: 'Nom',
    suffix: 'Suffixe',
    prefix: 'Préfixe',
    givenName: 'Prénom',
    familyName: 'Nom de famille',
    dateOfBirth: 'Date de naissance',
    approximateDateOfBirth: 'Date de naissance approximative',
    age: 'Âge',
    approximateAge: 'Âge approximatif',
    placeOfBirth: 'Lieu de naissance',
    sex: 'Sexe',
    phoneNumber: 'Numéro de téléphone',
    email: 'Email',
    address: 'Adresse',
    occupation: 'Profession',
    type: 'Type de patient',
    preferredLanguage: 'Langue',
    basicInformation: 'Informations de base',
    generalInformation: 'Informations générales',
    contactInformation: 'Informations du contact',
    unknownDateOfBirth: 'Inconnue',
    relatedPerson: 'Personne liée',
    relatedPersons: {
      error: {
        unableToAddRelatedPerson: "Impossible d'ajouter une nouvelle personne liée.",
        relatedPersonRequired: 'La personne liée est requise.',
        relationshipTypeRequired: 'Le type de relation est requis.',
      },
      label: 'Personnes liées',
      new: 'Nouvelle personne liée',
      add: 'Ajouter une personne liée',
      relationshipType: 'Type de relation',
      warning: {
        noRelatedPersons: 'Aucune personnes liées',
      },
      addRelatedPersonAbove: "Ajouter une personne liée à l'aide du bouton ci-dessus.",
    },
    appointments: {
      new: 'Ajouter un rendez-vous',
    },
    allergies: {
      label: 'Allergies',
      allergyName: "Nom de l'allergie",
      new: 'Ajouter une allergie',
      error: {
        nameRequired: "Le nom de l'allergie est requis.",
        unableToAdd: "Impossible d'ajouter l'allergie.",
      },
      warning: {
        noAllergies: "Pas d'allergies",
      },
      addAllergyAbove: "Ajouter une allergie à l'aide du bouton ci-dessus.",
      successfullyAdded: 'Nouvelle allergie ajoutée avec succès !',
    },
    diagnoses: {
      label: 'Diagnostics',
      new: 'Ajouter un diagnostic',
      diagnosisName: 'Nom',
      diagnosisDate: 'Date',
      warning: {
        noDiagnoses: 'Aucun diagnostic',
      },
      error: {
        nameRequired: 'Le nom du diagnostic est requis.',
        dateRequired: 'La date du diagnostic est requise.',
      },
      addDiagnosisAbove: "Ajouter un diagnostic à l'aide du bouton ci-dessus.",
      successfullyAdded: 'Nouveau diagnostic ajouté avec succès !',
    },
    note: 'Note',
    notes: {
      label: 'Notes',
      new: 'Ajouter une nouvelle note',
      warning: {
        noNotes: 'Pas de notes',
      },
      error: {
        noteRequired: 'Une note est requise.',
        unableToAdd: "Impossible d'ajouter une nouvelle note.",
      },
      addNoteAbove: "Ajouter une nouvelle note à l'aide du bouton ci-dessus..",
    },
    medications: {
      label: 'Médicaments',
      new: 'Ajouter un nouveau médicament',
      warning: {
        noMedications: 'Pas de médicaments',
      },
      noMedicationsMessage: 'Aucune demande de médicaments pour cette personne.',
    },
    types: {
      charity: 'Charité',
      private: 'Privé',
    },
    errors: {
      createPatientError: 'Impossible de créer un nouveau patient.',
      updatePatientError: 'Impossible de mettre à jour le patient.',
      patientGivenNameFeedback: 'Le prénom est obligatoire.',
      patientDateOfBirthFeedback:
        "La date de naissance ne peut pas être supérieure à celle d'ajourd'hui.",
    },
  },
}
