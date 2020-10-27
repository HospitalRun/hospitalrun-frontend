import actions from './actions'
import dashboard from './dashboard'
import labs from './labs'
import medications from './medications'
import patient from './patient'
import patients from './patients'
import scheduling from './scheduling'
import settings from './settings'
import sex from './sex'
import states from './states'

export default {
  ...actions,
  ...dashboard,
  ...patient,
  ...patients,
  ...scheduling,
  ...states,
  ...sex,
  ...labs,
  ...settings,
  ...medications,
}
