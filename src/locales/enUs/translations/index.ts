import actions from './actions'
import dashboard from './dashboard'
import incidents from './incidents'
import labs from './labs'
import networkStatus from './network-status'
import patient from './patient'
import patients from './patients'
import scheduling from './scheduling'
import settings from './settings'
import sex from './sex'
import states from './states'

export default {
  ...actions,
  ...dashboard,
  ...networkStatus,
  ...patient,
  ...patients,
  ...scheduling,
  ...states,
  ...sex,
  ...labs,
  ...incidents,
  ...settings,
}
