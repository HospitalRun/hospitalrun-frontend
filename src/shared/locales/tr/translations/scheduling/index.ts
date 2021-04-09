export default {
  scheduling: {
    label: 'Planlama',
    appointments: {
      label: 'Randevular',
      new: 'Yeni Randevu Oluştur',
      schedule: 'Randevuyu Planla',
      editAppointment: 'Randevuyu Düzenle',
      deleteAppointment: 'Randevuyu Sil',
      viewAppointment: 'Randevuyu Görüntüle',
      scheduleAppointment: 'Randevuyu Kaydet'

    },
    appointment: {
      startDate: 'Başlangıç Zamanı',
      endDate: 'Bitiş Zamanı',
      location: 'Yer',
      type: 'Tür',
      types: {
        checkup: 'Check-up',
        emergency: 'Acil',
        followUp: 'Kontrol',
        routine: 'Rutin',
        walkIn: 'Rezervasyonsuz',
      },
      errors: {
        patientRequired: 'Hasta alanı zorunludur.',
        errorCreatingAppointment: 'Randevu oluşturulurken hata!',
        startDateMustBeBeforeEndDate: 'Başlangıç zamanı Bitiş zamanından önce olmalıdır.',
      },
      reason: 'Gerekçe',
      patient: 'Hasta',
      deleteConfirmationMessage: 'Bu randevu kaydını silmek istediğinize emin misiniz?',
      successfullyCreated: 'Randevu kaydı başarılı bir şekilde oluşturuldu.',
    },
  },
}
