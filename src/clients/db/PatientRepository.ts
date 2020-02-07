import Patient from '../../model/Patient'
import Repository from './Repository'
import { patients } from '../../config/pouchdb'

const formatFriendlyId = (prefix: string, sequenceNumber: string) => `${prefix}${sequenceNumber}`

const generateSequenceNumber = (currentNumber: number): string => {
  const newNumber = currentNumber + 1
  if (newNumber < 10000) {
    return newNumber.toString().padStart(5, '0')
  }

  return newNumber.toString()
}

export class PatientRepository extends Repository<Patient> {
  constructor() {
    super(patients)
  }

  async search(text: string): Promise<Patient[]> {
    return super.search({
      selector: {
        $or: [
          {
            fullName: {
              $regex: RegExp(text, 'i'),
            },
          },
          {
            friendlyId: text,
          },
        ],
      },
    })
  }

  async getFriendlyId(): Promise<string> {
    const storedPatients = await this.findAll()

    if (storedPatients.length === 0) {
      return formatFriendlyId('P', generateSequenceNumber(0))
    }

    const maxPatient = storedPatients[storedPatients.length - 1]
    const { friendlyId } = maxPatient
    const currentSequenceNumber = friendlyId.slice(1, friendlyId.length)

    return formatFriendlyId('P', generateSequenceNumber(parseInt(currentSequenceNumber, 10)))
  }

  async save(entity: Patient): Promise<Patient> {
    const friendlyId = await this.getFriendlyId()
    entity.friendlyId = friendlyId
    return super.save(entity)
  }
}

export default new PatientRepository()
