export default {
  patient: {
    firstName: 'Nome',
    lastName: 'Sobrenome',
    suffix: 'Sufixo',
    prefix: 'Prefixo',
    givenName: 'Nome Próprio',
    familyName: 'Nome de Família',
    dateOfBirth: 'Data de Nascimento',
    approximateDateOfBirth: 'Data de Nascimento Aproximada',
    age: 'Idade',
    approximateAge: 'Idade Aproximada',
    placeOfBirth: 'Local de Nascimento',
    sex: 'Sexo',
    phoneNumber: 'Número de Telefone',
    email: 'E-mail',
    address: 'Endereço',
    occupation: 'Ocupação',
    type: 'Tipo de Paciente',
    preferredLanguage: 'Idioma de Preferência',
    basicInformation: 'Informação Básica',
    generalInformation: 'Informação Geral',
    contactInformation: 'Informação de Contato',
    unknownDateOfBirth: 'Data de Nascimento Desconhecida',
    relatedPerson: 'Pessoa Relacionada',
    relatedPersons: {
      error: {
        relatedPersonRequired: 'Pessoa relacionada é necessária.',
        relationshipTypeRequired: 'Tipo de relacionamento é necessário.',
      },
      label: 'Pessoas Relacionadas',
      new: 'Nova Pessoa Relacionada',
      relationshipType: 'Tipo de Relacionamento',
    },
    allergies: {
      label: 'Alergias',
      new: 'Adicionar alergia',
      error: {
        nameRequired: 'Nome da alergia é necessário.',
      },
      warning: {
        noAllergies: 'Sem alergias',
      },
      addAllergyAbove: 'Adicione uma alergia utilizando o botão acima.',
      successfullyAdded: 'Uma nova alergia foi adicionada com sucesso!',
    },
    diagnoses: {
      label: 'Diagnósticos',
      new: 'Novo diagnósticos',
      diagnosisName: 'Nome do diagnóstico',
      diagnosisDate: 'Data do diagnóstico',
      warning: {
        noDiagnoses: 'Sem diagnósticos',
      },
      error: {
        nameRequired: 'Nome do diagnóstico é necessário.',
        dateRequired: 'Data do diagnóstico é necessária.',
      },
      addDiagnosisAbove: 'Adicione um diagnóstico utilizando o botão acima.',
      successfullyAdded: 'Um novo diagnóstico foi adicionado com sucesso!',
    },
    types: {
      charity: 'Caridade',
      private: 'Particular',
    },
    errors: {
      patientGivenNameRequiredOnCreate: 'Nome do Paciente é necessário.',
      // todo Portuguese translation
      patientGivenNameRequiredOnUpdate: '',
      patientGivenNameFeedback: '',
    },
  },
}
