export default {
  imagings: {
    label: 'Imagings',
    status: {
      requested: 'Requested',
      completed: 'Completed',
      canceled: 'Canceled',
    },
    requests: {
      label: 'Imaging Requests',
      new: 'New Imaging Request',
      view: 'View Imaging',
      create: 'Request Imaging',
      cancel: 'Cancel Imaging',
      complete: 'Complete Imaging',
      error: {
        unableToRequest: 'Unable to create new imaging request.',
        incorrectStatus: 'Incorrect Status',
        typeRequired: 'Type is required.',
        statusRequired: 'Status is required.',
        patientRequired: 'Patient name is required.',
      },
    },
    imaging: {
      label: 'imaging',
      code: 'Imaging Code',
      status: 'Status',
      type: 'Type',
      notes: 'Notes',
      requestedOn: 'Requested On',
      completedOn: 'Completed On',
      canceledOn: 'Canceled On',
      requestedBy: 'Requested By',
      patient: 'Patient',
    },
  },
}
