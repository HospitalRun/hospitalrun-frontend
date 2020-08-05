import actions from './actions'
import bloodType from './blood-type'
import dashboard from './dashboard'
import imagings from './imagings'
import incidents from './incidents'
import labs from './labs'
import networkStatus from './network-status'
import patient from './patient'
import patients from './patients'
import scheduling from './scheduling'
import settings from './settings'
import sex from './sex'
import states from './states'
import user from './user'

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
  ...user,
  ...bloodType,
  ...imagings,
}
