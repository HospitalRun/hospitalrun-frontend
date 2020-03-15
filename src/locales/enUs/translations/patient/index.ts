export default {
  patient: {
    firstName: 'First Name',
    lastName: 'Last Name',
    suffix: 'Suffix',
    prefix: 'Prefix',
    givenName: 'Given Name',
    familyName: 'Family Name',
    dateOfBirth: 'Date of Birth',
    approximateDateOfBirth: 'Approximate Date of Birth',
    age: 'Age',
    approximateAge: 'Approximate Age',
    placeOfBirth: 'Place of Birth',
    sex: 'Sex',
    phoneNumber: 'Phone Number',
    email: 'Email',
    address: 'Address',
    occupation: 'Occupation',
    type: 'Patient Type',
    preferredLanguage: 'Preferred Language',
    basicInformation: 'Basic Information',
    generalInformation: 'General Information',
    contactInformation: 'Contact Information',
    unknownDateOfBirth: 'Unknown',
    relatedPerson: 'Related Person',
    relatedPersons: {
      error: {
        relatedPersonRequired: 'Related Person is required.',
        relationshipTypeRequired: 'Relationship Type is required.',
      },
      label: 'Related Persons',
      new: 'New Related Person',
      relationshipType: 'Relationship Type',
      warning: {
        noRelatedPersons: 'No related persons',
      },
      addRelatedPersonAbove: 'Add a related person using the button above.',
    },
    allergies: {
      label: 'Allergies',
      new: 'Add Allergy',
      error: {
        nameRequired: 'Name is required.',
      },
      warning: {
        noAllergies: 'No Allergies',
      },
      addAllergyAbove: 'Add an allergy using the button above.',
      successfullyAdded: 'Successfully added a new allergy!',
    },
    diagnoses: {
      label: 'Diagnoses',
      new: 'Add Diagnoses',
      diagnosisName: 'Diagnosis Name',
      diagnosisDate: 'Diagnosis Date',
      warning: {
        noDiagnoses: 'No Diagnoses',
      },
      error: {
        nameRequired: 'Diagnosis Name is required.',
        dateRequired: 'Diagnosis Date is required.',
      },
      addDiagnosisAbove: 'Add a diagnosis using the button above.',
      successfullyAdded: 'Successfully added a new diagnosis!',
    },
    types: {
      charity: 'Charity',
      private: 'Private',
    },
    errors: {
      patientGivenNameRequired: 'Patient Given Name is required.',
    },
  },
}
