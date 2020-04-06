enum Permissions {
  ReadPatients = 'read:patients',
  WritePatients = 'write:patients',
  ReadAppointments = 'read:appointments',
  WriteAppointments = 'write:appointments',
  DeleteAppointment = 'delete:appointment',
  AddAllergy = 'write:allergy',
  AddDiagnosis = 'write:diagnosis',
  RequestLab = 'write:labs',
  CancelLab = 'cancel:lab',
  CompleteLab = 'complete:lab',
  ViewLab = 'read:lab',
  ViewLabs = 'read:labs',
}

export default Permissions
