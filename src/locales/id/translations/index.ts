import actions from './actions'
import dashboard from './dashboard'
import labs from './labs'
import patient from './patient'
import patients from './patients'

export default {
  ...actions,
  ...dashboard,
  ...labs,
  ...patient,
  ...patients,
}
