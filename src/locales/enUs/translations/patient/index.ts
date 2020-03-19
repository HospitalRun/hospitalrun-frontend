export default {
  patient: {
    firstName: 'Ім’я',
    lastName: 'Прізвище',
    suffix: 'Суфікс',
    prefix: 'Префікс',
    givenName: 'ім’я при народженні',
    familyName: 'По батькові',
    dateOfBirth: 'Дата народження',
    approximateDateOfBirth: 'Приблизна дата народження',
    age: 'Вік',
    approximateAge: 'Приблизний вік',
    placeOfBirth: 'Місце народження',
    sex: 'Стать',
    phoneNumber: 'Номер телефону',
    email: 'Email',
    address: 'Адреса',
    occupation: 'Зайнятість',
    type: 'Тип пацієнта',
    preferredLanguage: 'мова спілкування',
    basicInformation: 'Базова інформація',
    generalInformation: 'Загальна Інформація',
    contactInformation: 'Контактна інформація',
    unknownDateOfBirth: 'невідомо',
    relatedPerson: 'Наближена особа (родич)',
    relatedPersons: {
      error: {
        relatedPersonRequired: 'додайте наближену особу',
        relationshipTypeRequired: 'додайте статус особи',
      },
      label: 'Наближена особа (родич)',
      new: 'Нова Наближена особа (родич)',
      relationshipType: 'статус наближеної особи (чоловік/дружина)',
      warning: {
        noRelatedPersons: 'Немає наближеної особи',
      },
      addRelatedPersonAbove: 'Додайте наближену особу використовуючи кнопку вище',
    },
    allergies: {
      label: 'Алергії',
      new: 'Додати алергію',
      error: {
        nameRequired: 'введіть ім’я',
      },
      warning: {
        noAllergies: 'Алергії відсутні',
      },
      addAllergyAbove: 'Додайте алергії використовуючи кнопку вище',
      successfullyAdded: 'Успішно додана нова алергія',
    },
    diagnoses: {
      label: 'Діагноз',
      new: 'Додати діагноз',
      diagnosisName: 'Назва діагнозу',
      diagnosisDate: 'Дата діагнозу',
      warning: {
        noDiagnoses: 'Діагноз відсутній',
      },
      error: {
        nameRequired: 'Введіть назву діагнозу',
        dateRequired: 'Введіть дату діагнозу',
      },
      addDiagnosisAbove: 'Додайте діагноз використовуючи кнопку вище',
      successfullyAdded: 'Діагноз успішно створений',
    },
    types: {
      charity: 'Благодійність',
      private: 'Особистий',
    },
    errors: {
      patientGivenNameRequired: 'Потрібно вказати ім’я пацієнта.',
    },
  },
}
