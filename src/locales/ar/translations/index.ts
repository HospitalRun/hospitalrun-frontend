import actions from './actions'
import dashboard from './dashboard'
import patient from './patient'
import patients from './patients'
import settings from './settings'

export default {
  ...actions,
  ...dashboard,
  ...patient,
  ...patients,
  ...settings,
}
