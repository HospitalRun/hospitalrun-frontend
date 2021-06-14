export default {
  imagings: {
    label: 'Görüntülemeler',
    status: {
      requested: 'Talep Edildi',
      completed: 'Tamamlandı',
      canceled: 'İptal Edildi',
    },
    requests: {
      label: 'Görüntüleme Talepleri',
      new: 'Yeni Görüntüleme Talebi',
      view: 'Görüntüleme Detaylarını Aç',
      create: 'Görüntüleme Talebini Oluştur',
      cancel: 'Görüntüleme Talebini İptal Et',
      complete: 'Görüntüleme Talebini Tamamla',
      error: {
        unableToRequest: 'Yeni görüntüleme talebi oluşturulamıyor.',
        incorrectStatus: 'Geçersiz Durum',
        typeRequired: 'Tür bilgisinin girilmesi zorunludur.',
        statusRequired: 'Durum bilgisinin girilmesi zorunludur.',
        patientRequired: 'Hasta adı bilgisinin girilmesi zorunludur.',
      },
    },
    imaging: {
      label: 'Görüntüleme',
      code: 'Görüntüleme Kodu',
      status: 'Durum',
      type: 'Tür',
      notes: 'Notlar',
      requestedOn: 'Talep Tarihi',
      completedOn: 'Tamamlanma Tarihi',
      canceledOn: 'İptal Tarihi',
      requestedBy: 'Talep Eden',
      patient: 'Hasta',
    },
  },
}
