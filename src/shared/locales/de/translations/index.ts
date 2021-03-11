import actions from './actions'
import dashboard from './dashboard'
import incidents from './incidents'
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
  ...settings,
  ...scheduling,
  ...states,
  ...sex,
  ...labs,
  ...incidents,
  ...medications,
}
