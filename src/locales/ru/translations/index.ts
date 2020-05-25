import actions from './actions'
import dashboard from './dashboard'
import labs from './labs'
import patient from './patient'
import patients from './patients'
import settings from './settings'

export default {
  ...actions,
  ...dashboard,
  ...labs,
  ...patient,
  ...patients,
  ...settings,
}
