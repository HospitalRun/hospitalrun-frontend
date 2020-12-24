import addDays from 'date-fns/addDays'

import validateIncident from '../../../incidents/util/validate-incident'
import Incident from '../../../shared/model/Incident'

describe('incident validator', () => {
  it('should validate the required fields apart of an incident', async () => {
    const newIncident = {} as Incident
    const expectedError = {
      date: 'incidents.reports.error.dateRequired',
      department: 'incidents.reports.error.departmentRequired',
      category: 'incidents.reports.error.categoryRequired',
      categoryItem: 'incidents.reports.error.categoryItemRequired',
      description: 'incidents.reports.error.descriptionRequired',
    }

    const actualError = validateIncident(newIncident)

    expect(actualError).toEqual(expectedError)
  })

  it('should validate that the incident date is not a date in the future', async () => {
    const newIncident = {
      description: 'description',
      date: addDays(new Date(), 4).toISOString(),
      department: 'some department',
      category: 'category',
      categoryItem: 'categoryItem',
    } as Incident
    const expectedError = {
      date: 'incidents.reports.error.dateMustBeInThePast',
    }

    const actualError = validateIncident(newIncident)

    expect(actualError).toEqual(expectedError)
  })
})
