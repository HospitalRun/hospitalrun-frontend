export default {
  imagings: {
    label: 'Изображения',
    status: {
      requested: 'Запрошено',
      completed: 'Выполнено',
      canceled: 'Отменено',
    },
    requests: {
      label: 'Запросы изображений',
      new: 'Запрос нового изображения',
      view: 'Просмотр изображения',
      create: 'Запросить',
      cancel: 'Отменить',
      complete: 'Выполнить',
      error: {
        unableToRequest: 'Новозможно создать новый запрос изображения.',
        incorrectStatus: 'Неверный статус',
        typeRequired: 'Необходимо указать тип.',
        statusRequired: 'Необходимо указать статус.',
        patientRequired: 'Необходимо указать пациента.',
      },
    },
    imaging: {
      label: 'изображение',
      code: 'Код изображения',
      status: 'Статус',
      type: 'Тип',
      notes: 'Заметки',
      requestedOn: 'Когда затребовано',
      completedOn: 'Когда выполнено',
      canceledOn: 'Когда отменено',
      requestedBy: 'Кем запрошено',
      patient: 'Пациент',
    },
  },
}
