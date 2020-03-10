import actions from './actions'
import dashboard from './dashboard'
import patient from './patient'
import patients from './patients'
import scheduling from './scheduling'
import states from './states'
import sex from './sex'

export default {
  ...actions,
  ...dashboard,
  ...patient,
  ...patients,
  ...scheduling,
  ...states,
  ...sex,
}
