type ContactInfoPiece = { id: string; value: string; type?: string }

interface ContactInformation {
  phoneNumbers: ContactInfoPiece[]
  emails: ContactInfoPiece[]
  addresses: ContactInfoPiece[]
}

export default ContactInformation
export type { ContactInfoPiece }
