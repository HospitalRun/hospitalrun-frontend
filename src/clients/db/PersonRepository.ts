import Person from '../../model/Persons/Person'
import Repository from './Repository'
import { persons } from '../../config/pouchdb'

const formatFriendlyId = (prefix: string, sequenceNumber: string) => `${prefix}${sequenceNumber}`

const generateSequenceNumber = (currentNumber: number): string => {
  const newNumber = currentNumber + 1
  if (newNumber < 10000) {
    return newNumber.toString().padStart(5, '0')
  }

  return newNumber.toString()
}

export class PersonRepository extends Repository<Person> {
  constructor() {
    super(persons)
  }

  async search(text: string): Promise<Person[]> {
    return super.search({
      selector: {
        $or: [
          {
            fullName: {
              $regex: `^(.)*${text}(.)*$`,
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
    const storedPersons = await this.findAll()

    if (storedPersons.length === 0) {
      return formatFriendlyId('P', generateSequenceNumber(0))
    }

    const maxPatient = storedPersons[storedPersons.length - 1]
    const { friendlyId } = maxPatient
    const currentSequenceNumber = friendlyId.slice(1, friendlyId.length)

    return formatFriendlyId('P', generateSequenceNumber(parseInt(currentSequenceNumber, 10)))
  }

  async save(entity: Person): Promise<Person> {
    const friendlyId = await this.getFriendlyId()
    entity.friendlyId = friendlyId
    return super.save(entity)
  }
}

export default new PersonRepository()
