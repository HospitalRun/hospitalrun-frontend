export default {
  scheduling: {
    label: 'Розклад',
    appointments: {
      label: 'Призначення',
      new: 'Нове Призначення',
      deleteAppointment: 'Видалити Призначення',
    },
    appointment: {
      startDate: 'Дата Початку',
      endDate: 'Дата Кінця',
      location: 'Місцезнаходження',
      type: 'Тип',
      types: {
        checkup: 'Перевірка',
        emergency: 'Невідкладний',
        followUp: 'Слідкувати',
        routine: 'Звичайний візит',
        walkIn: 'Жива черга',
      },
      successfullyCreated: 'Зустріч успішно створено',
      errors: {
        patientRequired: 'Пацієнт відсутній',
        errorCreatingAppointment: 'Не вдалося створити запис!',
        startDateMustBeBeforeEndDate: 'Час початку повинен бути меншим часу закінчення',
      },
      reason: 'Причина',
      patient: 'Пацієнт',
    },
  },
}
